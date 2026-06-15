import db, { eq, and } from "@repo/database";
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
} from "./model";
import { formFields } from "@repo/database/models/form-fields";

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
        isCommentsAllowed: data.isCommentsAllowed,
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
  public async getSavedFields(userId: string, payload: getSavedFieldsType) {
    const { formSlug } = await getSavedFieldsDto.parseAsync(payload);
    const [existingForm] = await db
      .select()
      .from(forms)
      .where(and(eq(forms.slug, formSlug), eq(forms.userId, userId)));
    if (!existingForm) {
      throw new AppError("NOT_FOUND", "Form not found");
    }
    const fields = await db.select().from(formFields).where(eq(formFields.formId, existingForm.formId));
    return {fields, form:existingForm};
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
}

export default FormServices;
