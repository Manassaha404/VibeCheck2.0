import db, { eq } from "@repo/database";
import { forms } from "@repo/database/models/forms";
import { AppError } from "@repo/error";
import { z } from "zod";
import { draftFormDto } from "./model";

export type DraftFormDtoType = z.infer<typeof draftFormDto>;

class FormServices {
  public async draftForm(userId: string, payload: DraftFormDtoType) {
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
}


export default FormServices;