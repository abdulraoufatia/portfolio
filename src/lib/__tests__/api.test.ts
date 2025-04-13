import { describe, it, expect, beforeEach } from 'vitest';
import { projectsApi, articlesApi, generateSlug } from '../api';

describe('API Functions', () => {
  describe('generateSlug', () => {
    it('converts title to slug format', () => {
      expect(generateSlug('Hello World!')).toBe('hello-world');
      expect(generateSlug('This is a Test')).toBe('this-is-a-test');
      expect(generateSlug('Special@#$Characters')).toBe('specialcharacters');
    });

    it('handles multiple spaces and special characters', () => {
      expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(generateSlug('With-Hyphens-Already')).toBe('with-hyphens-already');
    });
  });

  describe('projectsApi', () => {
    it('fetches all projects', async () => {
      const projects = await projectsApi.getAll();
      expect(projects).toHaveLength(1);
      expect(projects[0]).toHaveProperty('title', 'Test Project');
    });
  });

  describe('articlesApi', () => {
    it('fetches all articles', async () => {
      const articles = await articlesApi.getAll();
      expect(articles).toHaveLength(1);
      expect(articles[0]).toHaveProperty('title', 'Test Article');
    });

    it('generates slug for articles without one', async () => {
      const articles = await articlesApi.getAll();
      expect(articles[0].slug).toBeDefined();
    });
  });
});