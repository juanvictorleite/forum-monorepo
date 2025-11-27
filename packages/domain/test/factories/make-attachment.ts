import { faker } from "@faker-js/faker";
import type { UniqueEntityID } from "@/core";
import { Attachment, type AttachmentProps } from "@/domain";

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  );

  return attachment;
}
