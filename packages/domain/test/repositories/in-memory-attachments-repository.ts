import type { Attachment } from "@/domain";
import type { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachment: Attachment) {
    this.items.push(attachment);
  }
}
