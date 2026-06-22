import db, { eq, and, gte, sql, desc, ilike } from "@repo/database";
import { forms } from "@repo/database/models/forms";
import { AppError } from "@repo/error";
import {
  draftFormDto,
  DraftFormDtoType,
  getSavedFieldsDto,
  getSavedFieldsType,
  saveDraftFormDto,
  SaveDraftFormDtoType,
  publishFormDto,
  PublishFormDtoType,
  updateFormSettingsDto,
  UpdateFormSettingsDtoType,
  getFormAnalyticsDto,
  GetFormAnalyticsDtoType,
  getFormResponsesDto,
  GetFormResponsesDtoType,
  getPublicFormDto,
  GetPublicFormDtoType,
  PublicFormResult,
  FieldType,
  FieldAnalyticsData,
  AnalyticsField,
  FormAnalyticsResult,
  FormResponsesResult,
  FormResponseItem,
  FormResponseAnswer,
  submitStaticFormDto,
  SubmitStaticFormDtoType,
  getResumableUploadUrlDto,
  GetResumableUploadUrlDtoType,
  deleteFileDto,
  DeleteFileDtoType,
} from "./model";
import { formFields } from "@repo/database/models/form-fields";
import { formResponses } from "@repo/database/models/form-responses";
import { formAnswers } from "@repo/database/models/form-answers";
import { users } from "@repo/database/models/users";
import { auths } from "@repo/database/models/auths";
import { GoogleDriveService } from "../googleApis";
const googleDriveService = new GoogleDriveService();
class FormServices {
  public async createForm(userId: string, payload: DraftFormDtoType) {
    const data = draftFormDto.parse(payload);
    const [existingForm] = await db
      .select()
      .from(forms)
      .where(eq(forms.slug, data.slug));

    if (existingForm) {
      throw new AppError("CONFLICT", "slug already exists");
    }

    const expiresAtDate = data.expiresAt ? new Date(data.expiresAt) : null;

    const [newForm] = await db
      .insert(forms)
      .values({
        userId,
        title: data.title,
        slug: data.slug,
        description: data.description,
        passwordNeeded: data.passwordNeeded,
        password: data.password || null,
        expiresAt: expiresAtDate,
        responseLimit: data.responseLimit,
        allowResponseEdit: data.allowResponseEdit,
        status: "draft",
        isPublished: false,
      })
      .returning();

    return newForm;
  }
  public async saveDraft(userId: string, payload: SaveDraftFormDtoType) {
    const data = saveDraftFormDto.parse(payload);
    const [existingForm] = await db
      .select()
      .from(forms)
      .where(and(eq(forms.slug, data.formSlug), eq(forms.userId, userId)));

    if (!existingForm) {
      throw new AppError("NOT_FOUND", "Form not found");
    }

    // Update fields if provided
    if (data.fields) {
      await db
        .delete(formFields)
        .where(eq(formFields.formId, existingForm.formId));
      if (
        data.fields.some((e) => e.type === "file") &&
        !existingForm.googleDriveFolderId
      ) {
        const [userAuth] = await db
          .select()
          .from(auths)
          .where(eq(auths.userId, userId));
        if (!userAuth?.googleDriveRefreshToken) {
          throw new AppError("BAD_REQUEST", "");
        }
        let folderId;
        try {
          folderId = await googleDriveService.createFormFolder(
            userAuth.googleDriveRefreshToken,
            existingForm.slug,
          );
        } catch (error) {
          console.error("Google Drive API error:", error);
          throw new AppError("BAD_REQUEST", "Failed to access Google Drive. Please reconnect your account.");
        }
        await db
          .update(forms)
          .set({
            googleDriveFolderId: folderId,
          })
          .where(eq(forms.formId, existingForm.formId));
      }
      if (data.fields.length > 0) {
        const fieldsToInsert = data.fields.map((field, index) => ({
          formId: existingForm.formId,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder || null,
          isRequired: field.isRequired,
          isPrimary: field.isPrimary,
          helperText: field.helperText || null,
          options: field.options || null,
          orderIndex: index,
        }));

        await db.insert(formFields).values(fieldsToInsert);
      }
    }

    return existingForm;
  }

  public async updateFormSettings(userId: string, payload: UpdateFormSettingsDtoType) {
    const data = updateFormSettingsDto.parse(payload);
    
    const [existingForm] = await db
      .select()
      .from(forms)
      .where(and(eq(forms.slug, data.formSlug), eq(forms.userId, userId)));

    if (!existingForm) {
      throw new AppError("NOT_FOUND", "Form not found");
    }

    const updates: Partial<typeof forms.$inferInsert> = {};
    if (data.passwordNeeded !== undefined) updates.passwordNeeded = data.passwordNeeded;
    if (data.password !== undefined) updates.password = data.password;
    if (data.expiresAt !== undefined) updates.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    if (data.responseLimit !== undefined) updates.responseLimit = data.responseLimit;
    if (data.allowResponseEdit !== undefined) updates.allowResponseEdit = data.allowResponseEdit;

    if (Object.keys(updates).length > 0) {
      await db
        .update(forms)
        .set(updates)
        .where(eq(forms.formId, existingForm.formId));
    }

    return existingForm;
  }


  public async getPublicForm(
    payload: GetPublicFormDtoType,
    guestToken?: string,
  ): Promise<PublicFormResult> {
    const { username, slug, password, editMode } =
      getPublicFormDto.parse(payload);

    // Resolve username → userId
    const [user] = await db
      .select({ userId: users.userId })
      .from(users)
      .where(eq(users.username, username));

    if (!user) {
      throw new AppError("NOT_FOUND", "User not found");
    }

    // Fetch the published form
    const [form] = await db
      .select()
      .from(forms)
      .where(
        and(
          eq(forms.userId, user.userId),
          eq(forms.slug, slug),
          eq(forms.isPublished, true),
        ),
      );

    if (!form) {
      throw new AppError("NOT_FOUND", "Form not found or not published");
    }

    const baseResult = {
      formId: form.formId,
      title: form.title,
      description: form.description ?? null,
      slug: form.slug,
    };

    // Check expiry
    if (form.expiresAt && new Date() > form.expiresAt) {
      return { ...baseResult, access: "expired" };
    }

    // Check password
    if (form.passwordNeeded && form.password !== password) {
      return { ...baseResult, access: "password_required" };
    }

    // Check if already responded
    let previousAnswers: Record<string, unknown> | undefined = undefined;
    let existingResponseId: string | undefined = undefined;
    let hasResponded = false;

    if (guestToken) {
      const [existing] = await db
        .select()
        .from(formResponses)
        .where(
          and(
            eq(formResponses.formId, form.formId),
            eq(formResponses.guestToken, guestToken),
          ),
        );

      if (existing) {
        hasResponded = true;
        if (!editMode || !form.allowResponseEdit) {
          return {
            ...baseResult,
            access: "already_responded",
            allowResponseEdit: form.allowResponseEdit,
            responseId: existing.responseId,
          };
        } else {
          existingResponseId = existing.responseId;
          const answers = await db
            .select()
            .from(formAnswers)
            .where(eq(formAnswers.responseId, existing.responseId));

          previousAnswers = {};
          for (const ans of answers) {
            previousAnswers[ans.fieldId] = ans.value;
          }
        }
      }
    }

    // Check limit (only if they haven't responded yet or are creating a new response, but if they responded, they either returned already or are editing)
    if (!hasResponded && form.responseLimit) {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(formResponses)
        .where(eq(formResponses.formId, form.formId));
      const count = result[0]?.count ?? 0;
      if (count >= form.responseLimit) {
        return { ...baseResult, access: "limit_reached" };
      }
    }

    const fields = await db
      .select()
      .from(formFields)
      .where(eq(formFields.formId, form.formId))
      .orderBy(formFields.orderIndex);

    return {
      ...baseResult,
      access: "granted",
      previousAnswers,
      responseId: existingResponseId,
      fields: fields.map((f) => ({
        fieldId: f.fieldId,
        label: f.label,
        type: f.type as FieldType,
        placeholder: f.placeholder ?? null,
        helperText: f.helperText ?? null,
        isRequired: f.isRequired,
        isPrimary: f.isPrimary,
        options: (f.options as { id: string; value: string }[] | null) ?? null,
        orderIndex: f.orderIndex,
      })),
    };
  }

  public async submitStaticForm(
    payload: SubmitStaticFormDtoType,
    guestToken: string,
  ) {
    const data = submitStaticFormDto.parse(payload);
    const { formId, answers, responseId } = data;

    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.formId, formId));
    if (!form) throw new AppError("NOT_FOUND", "Form not found");

    if (form.expiresAt && new Date() > form.expiresAt) {
      throw new AppError("FORBIDDEN", "Form has expired");
    }

    if (!responseId && form.responseLimit) {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(formResponses)
        .where(eq(formResponses.formId, formId));
      const count = result[0]?.count ?? 0;
      if (count >= form.responseLimit) {
        throw new AppError("FORBIDDEN", "Response limit reached");
      }
    }

    let currentResponseId = responseId;

    if (currentResponseId) {
      // Update
      const [existing] = await db
        .select()
        .from(formResponses)
        .where(
          and(
            eq(formResponses.responseId, currentResponseId),
            eq(formResponses.guestToken, guestToken),
          ),
        );
      if (!existing) throw new AppError("FORBIDDEN", "Not your response");
      if (!form.allowResponseEdit)
        throw new AppError("FORBIDDEN", "Editing not allowed");

      await db
        .delete(formAnswers)
        .where(eq(formAnswers.responseId, currentResponseId));
    } else {
      // Insert new
      const [existing] = await db
        .select()
        .from(formResponses)
        .where(
          and(
            eq(formResponses.formId, formId),
            eq(formResponses.guestToken, guestToken),
          ),
        );
      if (existing) throw new AppError("FORBIDDEN", "Already submitted");

      const [newResponse] = await db
        .insert(formResponses)
        .values({ formId, guestToken })
        .returning({ responseId: formResponses.responseId });

      if (!newResponse)
        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          "Failed to create response",
        );
      currentResponseId = newResponse.responseId;
    }

    const answersToInsert = Object.entries(answers).map(([fieldId, value]) => ({
      fieldId,
      responseId: currentResponseId as string,
      value: value as any,
    }));

    if (answersToInsert.length > 0) {
      await db.insert(formAnswers).values(answersToInsert);
    }

    return { responseId: currentResponseId };
  }

  public async getSavedFields(userId: string, payload: getSavedFieldsType) {
    const { formSlug } = await getSavedFieldsDto.parseAsync(payload);
    const [existingForm] = await db
      .select()
      .from(forms)
      .where(and(eq(forms.slug, formSlug), eq(forms.userId, userId)));
    if (!existingForm) {
      throw new AppError("NOT_FOUND", "Form not found");
    }
    const fields = await db
      .select()
      .from(formFields)
      .where(eq(formFields.formId, existingForm.formId));
    return { fields, form: existingForm };
  }
  public async publishForm(userId: string, payload: PublishFormDtoType) {
    const data = publishFormDto.parse(payload);
    const [existingForm] = await db
      .select()
      .from(forms)
      .where(and(eq(forms.slug, data.formSlug), eq(forms.userId, userId)));

    if (!existingForm) {
      throw new AppError("NOT_FOUND", "Form not found");
    }

    const [publishedForm] = await db
      .update(forms)
      .set({
        isPublished: true,
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(forms.formId, existingForm.formId))
      .returning();

    return publishedForm;
  }

  public async getFormAnalytics(
    userId: string,
    payload: GetFormAnalyticsDtoType,
  ): Promise<FormAnalyticsResult> {
    const { formSlug } = getFormAnalyticsDto.parse(payload);

    // 1. Fetch the form (owner check)
    const [form] = await db
      .select()
      .from(forms)
      .where(and(eq(forms.slug, formSlug), eq(forms.userId, userId)));

    if (!form) {
      throw new AppError("NOT_FOUND", "Form not found");
    }

    // 2. Fetch all fields ordered
    const fields = await db
      .select()
      .from(formFields)
      .where(eq(formFields.formId, form.formId))
      .orderBy(formFields.orderIndex);

    // 3. Fetch all responses for the form
    const responses = await db
      .select()
      .from(formResponses)
      .where(eq(formResponses.formId, form.formId));

    const totalResponses = responses.length;
    const responseIds = responses.map((r) => r.responseId);

    // 4. Compute weekly response counts (last 6 weeks)
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

    // Build weekly buckets
    const weeklyMap: Record<string, number> = {};
    for (let w = 0; w < 6; w++) {
      const label = w === 0 ? "This Wk" : w === 1 ? "Last Wk" : `${w} Wks Ago`;
      weeklyMap[label] = 0;
    }
    for (const r of responses) {
      const daysAgo = Math.floor(
        (Date.now() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysAgo < 42) {
        const weekIndex = Math.floor(daysAgo / 7); // 0 = most recent
        const label =
          weekIndex === 0
            ? "This Wk"
            : weekIndex === 1
              ? "Last Wk"
              : `${weekIndex} Wks Ago`;
        if (weeklyMap[label] !== undefined) {
          weeklyMap[label]!++;
        }
      }
    }
    const weeklyResponses = Object.entries(weeklyMap)
      .map(([week, count]) => ({ week, count }))
      .reverse();

    // 5. Fetch all answers for all responses (if any)
    let allAnswers: {
      answerId: string;
      fieldId: string;
      responseId: string;
      value: unknown;
    }[] = [];
    if (responseIds.length > 0) {
      allAnswers = await db
        .select()
        .from(formAnswers)
        .where(
          sql`${formAnswers.responseId} = ANY(${sql.raw(`ARRAY[${responseIds.map((id) => `'${id}'`).join(",")}]::uuid[]`)})`,
        );
    }

    // Group answers by fieldId
    const answersByField: Record<string, unknown[]> = {};
    for (const answer of allAnswers) {
      if (!answersByField[answer.fieldId]) {
        answersByField[answer.fieldId] = [];
      }
      answersByField[answer.fieldId]!.push(answer.value);
    }

    // 6. Build per-field analytics
    const analyticsFields: AnalyticsField[] = fields.map((field) => {
      const rawAnswers = answersByField[field.fieldId] ?? [];
      const type = field.type as FieldType;
      let analytics: FieldAnalyticsData;

      // Text-type fields
      if (
        type === "short_text" ||
        type === "long_text" ||
        type === "email" ||
        type === "phone"
      ) {
        const samples = rawAnswers
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .filter(Boolean)
          .slice(0, 20);
        analytics = { kind: "text", samples, totalAnswered: rawAnswers.length };
      }
      // Mood field
      else if (type === "mood") {
        const tally: Record<string, number> = {};
        for (const v of rawAnswers) {
          const key = typeof v === "string" ? v : JSON.stringify(v);
          tally[key] = (tally[key] ?? 0) + 1;
        }
        const total = rawAnswers.length || 1;
        const distribution = Object.entries(tally).map(([mood, count]) => ({
          mood,
          count,
          pct: Math.round((count / total) * 100),
        }));
        analytics = {
          kind: "mood",
          distribution,
          totalAnswered: rawAnswers.length,
        };
      }
      // Single/multi select, radio, checkbox
      else if (
        type === "select" ||
        type === "radio" ||
        type === "multi_select" ||
        type === "checkbox"
      ) {
        const tally: Record<string, number> = {};
        // Pre-populate from field options
        const fieldOptions: string[] = Array.isArray(field.options)
          ? (field.options as string[])
          : [];
        for (const opt of fieldOptions) {
          tally[String(opt)] = 0;
        }
        for (const v of rawAnswers) {
          if (Array.isArray(v)) {
            for (const item of v as unknown[]) {
              const key = String(item);
              tally[key] = (tally[key] ?? 0) + 1;
            }
          } else {
            const key = String(v);
            tally[key] = (tally[key] ?? 0) + 1;
          }
        }
        const totalVotes = Object.values(tally).reduce((a, b) => a + b, 0) || 1;
        const options = Object.entries(tally).map(([label, count]) => ({
          label,
          count,
          pct: Math.round((count / totalVotes) * 100),
        }));
        analytics = {
          kind: "choice",
          options,
          totalAnswered: rawAnswers.length,
        };
      }
      // Numeric / rating / scale
      else if (type === "number" || type === "rating" || type === "scale") {
        const nums = rawAnswers
          .map((v) => parseFloat(String(v)))
          .filter((n) => !isNaN(n));
        const average =
          nums.length > 0
            ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) /
              10
            : 0;
        const min = nums.length > 0 ? Math.min(...nums) : 0;
        const max = nums.length > 0 ? Math.max(...nums) : 0;

        // Distribution buckets (1-5 for rating/scale, or 5 equal buckets for number)
        const bucketCount =
          type === "rating" || type === "scale" ? Math.ceil(max) || 5 : 5;
        const distribution: { label: string; count: number }[] = [];
        if (type === "rating" || type === "scale") {
          for (let i = 1; i <= Math.max(bucketCount, 5); i++) {
            distribution.push({
              label: String(i),
              count: nums.filter((n) => Math.round(n) === i).length,
            });
          }
        } else {
          const range = max - min || 1;
          const step = range / 5;
          for (let i = 0; i < 5; i++) {
            const lo = min + step * i;
            const hi = min + step * (i + 1);
            distribution.push({
              label: `${Math.round(lo)}-${Math.round(hi)}`,
              count: nums.filter((n) => n >= lo && (i === 4 ? n <= hi : n < hi))
                .length,
            });
          }
        }
        analytics = {
          kind: "numeric",
          average,
          min,
          max,
          distribution,
          totalAnswered: rawAnswers.length,
        };
      }
      // Date field
      else if (type === "date") {
        const monthTally: Record<string, number> = {};
        for (const v of rawAnswers) {
          const d = new Date(String(v));
          if (!isNaN(d.getTime())) {
            const label = d.toLocaleString("default", {
              month: "short",
              year: "2-digit",
            });
            monthTally[label] = (monthTally[label] ?? 0) + 1;
          }
        }
        const distribution = Object.entries(monthTally).map(
          ([label, count]) => ({
            label,
            count,
          }),
        );
        analytics = {
          kind: "date",
          distribution,
          totalAnswered: rawAnswers.length,
        };
      }
      // File field
      else {
        analytics = { kind: "file", totalUploads: rawAnswers.length };
      }

      return {
        fieldId: field.fieldId,
        label: field.label,
        type,
        orderIndex: field.orderIndex,
        analytics,
      };
    });

    return {
      form: {
        formId: form.formId,
        title: form.title,
        slug: form.slug,
        status: form.status,
        createdAt: form.createdAt,
        responseLimit: form.responseLimit,
        expiresAt: form.expiresAt ?? null,
      },
      totalResponses,
      weeklyResponses,
      fields: analyticsFields,
    };
  }

  public async getFormResponses(
    userId: string,
    payload: GetFormResponsesDtoType,
  ): Promise<FormResponsesResult> {
    const { formSlug, page, limit, search } =
      getFormResponsesDto.parse(payload);
    const offset = (page - 1) * limit;

    // 1. Verify ownership
    const [form] = await db
      .select()
      .from(forms)
      .where(and(eq(forms.slug, formSlug), eq(forms.userId, userId)));

    if (!form) {
      throw new AppError("NOT_FOUND", "Form not found");
    }

    // 2. Fetch all fields ordered
    const fields = await db
      .select()
      .from(formFields)
      .where(eq(formFields.formId, form.formId))
      .orderBy(formFields.orderIndex);

    const primaryField = fields.find((f) => f.isPrimary) ?? null;

    // 3. Build field map for label lookup
    const fieldMap: Record<string, (typeof fields)[number]> = {};
    for (const f of fields) {
      fieldMap[f.fieldId] = f;
    }

    // 4. If search is provided, find responseIds matching the primary field value
    let matchingResponseIds: string[] | null = null;
    if (search && primaryField) {
      const searchLower = `%${search.toLowerCase()}%`;
      const matchingAnswers = await db
        .select({ responseId: formAnswers.responseId })
        .from(formAnswers)
        .where(
          and(
            eq(formAnswers.fieldId, primaryField.fieldId),
            sql`LOWER(${formAnswers.value}::text) LIKE ${searchLower}`,
          ),
        );
      matchingResponseIds = matchingAnswers.map((a) => a.responseId);
    }

    // 5. Fetch total count for pagination
    const allResponses = await db
      .select({
        responseId: formResponses.responseId,
        createdAt: formResponses.createdAt,
      })
      .from(formResponses)
      .where(
        matchingResponseIds !== null
          ? sql`${formResponses.formId} = ${form.formId} AND ${formResponses.responseId} = ANY(${sql.raw(`ARRAY[${matchingResponseIds.length > 0 ? matchingResponseIds.map((id) => `'${id}'`).join(",") : "'00000000-0000-0000-0000-000000000000'"}]::uuid[]`)})`
          : eq(formResponses.formId, form.formId),
      )
      .orderBy(desc(formResponses.createdAt));

    const total = allResponses.length;

    // 6. Slice to page
    const pageResponses = allResponses.slice(offset, offset + limit);
    const pageResponseIds = pageResponses.map((r) => r.responseId);

    // 7. Fetch answers for this page's responses
    let pageAnswers: {
      answerId: string;
      fieldId: string;
      responseId: string;
      value: unknown;
    }[] = [];
    if (pageResponseIds.length > 0) {
      pageAnswers = await db
        .select()
        .from(formAnswers)
        .where(
          sql`${formAnswers.responseId} = ANY(${sql.raw(`ARRAY[${pageResponseIds.map((id) => `'${id}'`).join(",")}]::uuid[]`)})`,
        );
    }

    // Group answers by responseId
    const answersByResponse: Record<string, typeof pageAnswers> = {};
    for (const ans of pageAnswers) {
      if (!answersByResponse[ans.responseId]) {
        answersByResponse[ans.responseId] = [];
      }
      answersByResponse[ans.responseId]!.push(ans);
    }

    // 8. Build response items
    const responseItems: FormResponseItem[] = pageResponses.map((r) => {
      const answers = answersByResponse[r.responseId] ?? [];

      // Build typed answers array in field order
      const typedAnswers: FormResponseAnswer[] = fields
        .map((field) => {
          const ans = answers.find((a) => a.fieldId === field.fieldId);
          return {
            fieldId: field.fieldId,
            fieldLabel: field.label,
            fieldType: field.type as FieldType,
            isPrimary: field.isPrimary,
            value: ans?.value ?? null,
          };
        })
        .filter((a) => a.value !== null || a.isPrimary);

      // Determine respondent identity from primary field
      let respondentIdentity = "Anonymous Vibe";
      if (primaryField) {
        const primaryAnswer = answers.find(
          (a) => a.fieldId === primaryField.fieldId,
        );
        if (primaryAnswer?.value) {
          const v = primaryAnswer.value;
          respondentIdentity = typeof v === "string" ? v : JSON.stringify(v);
        }
      }

      // Derive avatar initials (up to 2 chars from words)
      const initials =
        respondentIdentity
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase() ?? "")
          .join("") || "?";

      return {
        responseId: r.responseId,
        respondentIdentity,
        respondentAvatar: initials,
        submittedAt: r.createdAt.toISOString(),
        answers: typedAnswers,
      };
    });

    return {
      form: {
        formId: form.formId,
        title: form.title,
        slug: form.slug,
      },
      fields: fields.map((f) => ({
        fieldId: f.fieldId,
        label: f.label,
        type: f.type as FieldType,
        isPrimary: f.isPrimary,
        orderIndex: f.orderIndex,
      })),
      responses: responseItems,
      total,
      page,
      pageSize: limit,
    };
  }

  public async getResumableUploadUrl(payload: GetResumableUploadUrlDtoType) {
    const data = getResumableUploadUrlDto.parse(payload);

    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.formId, data.formId));

    if (!form) {
      throw new AppError("NOT_FOUND", "Form not found");
    }

    if (!form.googleDriveFolderId) {
      throw new AppError("BAD_REQUEST", "Form does not have a Google Drive folder configured.");
    }

    const [userAuth] = await db
      .select()
      .from(auths)
      .where(eq(auths.userId, form.userId));

    if (!userAuth || !userAuth.googleDriveRefreshToken) {
      throw new AppError("BAD_REQUEST", "Form owner has not connected Google Drive.");
    }

    try {
      const uploadUrl = await googleDriveService.getResumableUploadUrl(
        userAuth.googleDriveRefreshToken,
        form.googleDriveFolderId,
        data.file
      );
      return { uploadUrl };
    } catch (error: any) {
      console.error("Failed to get resumable upload URL:", error);
      throw new AppError("INTERNAL_SERVER_ERROR", error.message || "Failed to initiate file upload.");
    }
  }

  public async deleteFile(payload: DeleteFileDtoType) {
    const data = deleteFileDto.parse(payload);

    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.formId, data.formId));

    if (!form) {
      throw new AppError("NOT_FOUND", "Form not found");
    }

    const [userAuth] = await db
      .select()
      .from(auths)
      .where(eq(auths.userId, form.userId));

    if (!userAuth || !userAuth.googleDriveRefreshToken) {
      throw new AppError("BAD_REQUEST", "Form owner has not connected Google Drive.");
    }

    try {
      await googleDriveService.deleteFile(
        userAuth.googleDriveRefreshToken,
        data.fileId
      );
      return { success: true };
    } catch (error) {
      console.error("deleteFile service error:", error);
      throw new AppError("INTERNAL_SERVER_ERROR", "Failed to delete file from Google Drive");
    }
  }

}

export default FormServices;
