import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { timestamps } from '../utils/date'
import { hashing } from '../utils/hashing'
import { v4 as uuidv4 } from 'uuid'
import { createUser, createUserAccess, createUserContact } from '../services/user.service'
import createServer from '../utils/server'

const app = createServer()

const createUserPayload = (data: any) => {
  const userid = new mongoose.Types.ObjectId()
  const accessid = new mongoose.Types.ObjectId()
  const contactid = new mongoose.Types.ObjectId()

  data._id = userid
  data.uuid = uuidv4()
  data.password = `${hashing(data.password)}`
  data.createdAt = timestamps()
  data.updatedAt = timestamps()
  data.access = accessid
  data.contact = contactid

  data.userContact._id = contactid
  data.userContact.uuid = uuidv4()
  data.userContact.user = userid
  data.userContact.createdAt = timestamps()
  data.userContact.updatedAt = timestamps()

  data.userAccess._id = accessid
  data.userAccess.uuid = uuidv4()
  data.userAccess.user = userid
  data.userAccess.createdAt = timestamps()
  data.userAccess.updatedAt = timestamps()

  return data
}

const { createPayloadUserAdmin, createPayloadUserManager, createPayloadUserRegular, userAdmin, updateUserManager } = {
  // User
  createPayloadUserAdmin: {
    firstname: 'Admin',
    lastname: 'istrator',
    username: 'admin123',
    password: 'admin123',
    userAccess: { role: 'admin' },
    userContact: {
      email: 'admin@gmail.com',
      phone: '08123141412'
    },
    profileImage: 'helloworld.png'
  },
  createPayloadUserManager: {
    firstname: 'Manager',
    lastname: '',
    username: 'manager123',
    password: 'manager123',
    userAccess: { role: 'manager' },
    userContact: {
      email: 'manager@gmail.com',
      phone: '08123141412'
    },
    profileImage: 'helloworld.png'
  },
  createPayloadUserRegular: {
    firstname: 'Regular',
    lastname: '',
    username: 'regular123',
    password: 'regular123',
    userAccess: { role: 'regular' },
    userContact: {
      email: 'regular@gmail.com',
      phone: '08123141412'
    },
    profileImage: 'helloworld.png'
  },
  // login
  userAdmin: {
    username: 'admin123',
    password: 'admin123'
  },
  // Update
  updateUserManager: {
    firstname: 'hahahha',
    userContact: {
      phone: '08987123217'
    }
  }
}

const admin: any = createUserPayload(createPayloadUserAdmin)
const manager: any = createUserPayload(createPayloadUserManager)
const regular: any = createUserPayload(createPayloadUserRegular)

describe('**************** User ****************', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())

    // Admin
    await createUser(admin)
    await createUserAccess(admin.userAccess)
    await createUserContact(admin.userContact)

    // Manager
    await createUser(manager)
    await createUserAccess(manager.userAccess)
    await createUserContact(manager.userContact)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  // CREATE
  describe('################ Create User ################', () => {
    describe('if user is not logged in as Admin', () => {
      it('Try request post, should return a statusCode 403, forbidden', async () => {
        await supertest(app).post('/api/user').send(regular).expect(403)
      })
    })
    describe('if user is already logged in as Admin', () => {
      it('Try request post, should return a statusCode 201, Created', async () => {
        const { body } = await supertest(app).post('/api/auth/login').send(userAdmin)

        const resultReq = await supertest(app)
          .post('/api/user')
          .send(regular)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('Created')
        expect(resultReq.body.statusCode).toBe(201)
        expect(resultReq.statusCode).toBe(201)
      })
    })
  })

  // READ
  describe('################ Get All User ################', () => {
    describe('if user is not logged in as Admin', () => {
      it('Try request post, should return a statusCode 403, forbidden', async () => {
        await supertest(app).get('/api/user').expect(403)
      })
    })
    describe('if user is already logged in as Admin', () => {
      it('Try request post, should return a statusCode 200, OK', async () => {
        const { body } = await supertest(app).post('/api/auth/login').send(userAdmin)

        const resultReq = await supertest(app)
          .get('/api/user')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.body.result.length > 0).toBe(true)
        expect(resultReq.statusCode).toBe(200)
      })
    })
  })

  describe('################ Get User By ID ################', () => {
    describe('if user is not logged in as Admin', () => {
      it('Try request post, should return a statusCode 403, forbidden', async () => {
        await supertest(app).get(`/api/user/${admin.uuid}`).expect(403)
      })
    })
    describe('if user is already logged in as Admin', () => {
      it('Try request post, should return a statusCode 200, OK', async () => {
        const { body } = await supertest(app).post('/api/auth/login').send(userAdmin)

        const resultReq = await supertest(app)
          .get(`/api/user/${admin.uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.body.result.uuid).toBe(admin.uuid)
        expect(resultReq.statusCode).toBe(200)
      })

      it('Try request post, should return a statusCode 404, Data not found', async () => {
        const { body } = await supertest(app).post('/api/auth/login').send(userAdmin)

        const resultReq = await supertest(app)
          .get('/api/user/wrong-uuid')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe(false)
        expect(resultReq.body.statusCode).toBe(404)
        expect(resultReq.body.result.length === 0).toBe(true)
        expect(resultReq.statusCode).toBe(404)
      })
    })
  })

  // UPDATE
  describe('################ Update User By ID ################', () => {
    describe('if user is not logged in as Admin', () => {
      it('Try request put, should return a statusCode 403, forbidden', async () => {
        await supertest(app).put(`/api/user/${manager.uuid}`).send(updateUserManager)
      })
    })
    describe('if user is already logged in as Admin', () => {
      it('Try request put, should return a statusCode 200, OK', async () => {
        const { body } = await supertest(app).post('/api/auth/login').send(userAdmin)

        const resultReq = await supertest(app)
          .put(`/api/user/${manager.uuid}`)
          .send(updateUserManager)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
      })

      it('Try request put, should return a statusCode 404, with wrong params', async () => {
        const { body } = await supertest(app).post('/api/auth/login').send(userAdmin)

        const resultReq = await supertest(app)
          .put('/api/user/wrong-uuid')
          .send(updateUserManager)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe(false)
        expect(resultReq.body.statusCode).toBe(404)
        expect(resultReq.statusCode).toBe(404)
      })
    })
  })

  // DELETE
  describe('################ Delete User By ID ################', () => {
    describe('if user is not logged in as Admin', () => {
      it('Try request delete, should return a statusCode 403, forbidden', async () => {
        await supertest(app).delete(`/api/user/${manager.uuid}`).expect(403)
      })
    })
    describe('if user is already logged in as Admin', () => {
      it('Try request delete, should return a statusCode 200, OK', async () => {
        const { body } = await supertest(app).post('/api/auth/login').send(userAdmin)

        const resultReq = await supertest(app)
          .delete(`/api/user/${manager.uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
      })

      it('Try request delete, should return a statusCode 404, with wrong params', async () => {
        const { body } = await supertest(app).post('/api/auth/login').send(userAdmin)

        const resultReq = await supertest(app)
          .delete('/api/user/wrong-uuid')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe(false)
        expect(resultReq.body.statusCode).toBe(404)
        expect(resultReq.statusCode).toBe(404)
      })
    })
  })
})
