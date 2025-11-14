import { BaseController } from '../../core/Controller/BaseController';
import { Entry } from '../models/Entry';
import { UuidUtils } from '../../core/Utils';

export class EntryController extends BaseController {
  private entryModel = new Entry();

  async getAllEntries() {
    try {
      if (!this.ctx) throw new Error('Context not set');

      const entries = await this.entryModel.getAllEntries();

      const response = this.success(
        { entries },
        'Entries retrieved successfully'
      );

      this.send(response);
    } catch (error) {
      const response = this.error('Failed to retrieve entries');
      this.send(response);
    }
  }

  async createEntry() {
    try {
      if (!this.ctx) throw new Error('Context not set');

      const { title, cipherText } = this.ctx.req.body;

      if (!title || typeof title !== 'string') {
        const response = this.error('Title is required and must be a string', 400);
        this.send(response);
        return;
      }

      if (!cipherText || typeof cipherText !== 'string') {
        const response = this.error('cipherText is required and must be a string', 400);
        this.send(response);
        return;
      }

      const id = UuidUtils.generate();

      const entry = await this.entryModel.create({
        id,
        title,
        cipherText,
      });

      const response = this.success(
        { id: entry.id },
        'Entry created successfully'
      );

      this.send(response);
    } catch (error) {
      const response = this.error('Failed to create entry');
      this.send(response);
    }
  }

  async getEntry() {
    try {
      if (!this.ctx) throw new Error('Context not set');

      const { id } = this.ctx.req.params;

      if (!UuidUtils.isValid(id)) {
        const response = this.error('Invalid entry ID', 400);
        this.send(response);
        return;
      }

      const entry = await this.entryModel.findByUUID(id);

      if (!entry) {
        const response = this.error('Entry not found', 404);
        this.send(response);
        return;
      }

      const response = this.success(entry, 'Entry retrieved successfully');
      this.send(response);
    } catch (error) {
      const response = this.error('Failed to retrieve entry');
      this.send(response);
    }
  }

  async updateEntry() {
    try {
      if (!this.ctx) throw new Error('Context not set');

      const { id } = this.ctx.req.params;
      const { title, cipherText } = this.ctx.req.body;

      if (!UuidUtils.isValid(id)) {
        const response = this.error('Invalid entry ID', 400);
        this.send(response);
        return;
      }

      const entry = await this.entryModel.findByUUID(id);

      if (!entry) {
        const response = this.error('Entry not found', 404);
        this.send(response);
        return;
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (cipherText !== undefined) updateData.cipherText = cipherText;

      if (Object.keys(updateData).length === 0) {
        const response = this.error('No fields to update', 400);
        this.send(response);
        return;
      }

      const updated = await this.entryModel.updateByUUID(id, updateData);

      const response = this.success(updated, 'Entry updated successfully');
      this.send(response);
    } catch (error) {
      const response = this.error('Failed to update entry');
      this.send(response);
    }
  }

  async deleteEntry() {
    try {
      if (!this.ctx) throw new Error('Context not set');

      const { id } = this.ctx.req.params;

      if (!UuidUtils.isValid(id)) {
        const response = this.error('Invalid entry ID', 400);
        this.send(response);
        return;
      }

      const entry = await this.entryModel.findByUUID(id);

      if (!entry) {
        const response = this.error('Entry not found', 404);
        this.send(response);
        return;
      }

      await this.entryModel.deleteByUUID(id);

      const response = this.success(
        { deletedId: id },
        'Entry deleted successfully'
      );

      this.send(response);
    } catch (error) {
      const response = this.error('Failed to delete entry');
      this.send(response);
    }
  }
}
