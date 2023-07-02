import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { createTestContact, createTestUser, getTestContact, removeAllTestContacts, removeTestUser } from './test-util.js';

describe('POST /api/contacts', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should can create a contact', async () => {
    const result = await supertest(web).post('/api/contacts').set('Authorization', 'test').send({
      first_name: 'test',
      last_name: 'test',
      email: 'test@gmail.com',
      phone: '085123',
    });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe('test');
    expect(result.body.data.last_name).toBe('test');
    expect(result.body.data.email).toBe('test@gmail.com');
    expect(result.body.data.phone).toBe('085123');
  });

  it('should reject to create a contact if request is invalid', async () => {
    const result = await supertest(web).post('/api/contacts').set('Authorization', 'test').send({
      first_name: '',
      last_name: 'test',
      email: 'testmail.com',
      phone: '085123312312398191231234',
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /api/contacts/contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should can get a contact by contacId', async () => {
    const testContact = await getTestContact();
    const result = await supertest(web).get(`/api/contacts/${testContact.id}`).set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it('should return 404 if contactId is not found', async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .get(`/api/contacts/${testContact.id + 1}`)
      .set('Authorization', 'test');

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe('PUT /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should can update existing contact', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put('/api/contacts/' + testContact.id)
      .set('Authorization', 'test')
      .send({
        first_name: 'Luthfi',
        last_name: 'Kamal',
        email: 'luthfi@gmail.com',
        phone: '123123',
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe('Luthfi');
    expect(result.body.data.last_name).toBe('Kamal');
    expect(result.body.data.email).toBe('luthfi@gmail.com');
    expect(result.body.data.phone).toBe('123123');
  });
});
