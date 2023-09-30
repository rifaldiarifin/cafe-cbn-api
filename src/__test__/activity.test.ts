import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import createServer from '../utils/server'
import { createUser, createUserAccess, createUserContact } from '../services/user.service'
import { v4 as uuidv4 } from 'uuid'
import { hashing } from '../utils/hashing'
import { timestamps } from '../utils/date'
import { findActivityFromDB } from '../services/activity.service'

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

const { activityPayload1 } = {
  activityPayload1: {
    activity: 'Login'
  }
}

const { createPayloadUserAdmin, createPayloadUserRegular, userAdmin, userRegular } = {
  // User

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
  createPayloadUserAdmin: {
    firstname: 'Admin',
    lastname: 'istrator',
    username: 'admin',
    password: 'admin',
    userAccess: { role: 'admin' },
    userContact: {
      email: 'admin3@gmail.com',
      phone: '08123141412'
    },
    profileImage: 'helloworld.png'
  },
  // login
  userRegular: {
    username: 'regular123',
    password: 'regular123'
  },
  userAdmin: {
    username: 'admin',
    password: 'admin'
  }
}

const admin: any = createUserPayload(createPayloadUserAdmin)
const regular: any = createUserPayload(createPayloadUserRegular)

describe('**************** Activity ****************', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())

    // Regular
    await createUser(regular)
    await createUserAccess(regular.userAccess)
    await createUserContact(regular.userContact)

    // Admin
    await createUser(admin)
    await createUserAccess(admin.userAccess)
    await createUserContact(admin.userContact)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  // CREATE
  describe('################ Create Activity ################', () => {
    describe('if user not logged in', () => {
      it('Try request post, should return a statusCode 403, forbidden', async () => {
        await supertest(app).post('/activity').send(activityPayload1).expect(403)
      })
    })

    describe('if user is already logged in', () => {
      it('Try request post, should return a statusCode 201, Created', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const requestReq = await supertest(app)
          .post('/activity')
          .send(activityPayload1)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(requestReq.body.statusCode).toBe(201)
        expect(requestReq.statusCode).toBe(201)
        expect(requestReq.body.status).toBe('Created')
      })
    })
  })

  // READ
  describe('################ Get Activity ################', () => {
    describe('if user not logged in', () => {
      it('Try request get, should return a statusCode 403, forbidden', async () => {
        await supertest(app).get('/activity').expect(403)
      })
    })

    describe('if user is already logged in as admin', () => {
      it('Try request get, should return a statusCode 200, OK', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const resultReq = await supertest(app)
          .get('/activity')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
      })
    })
  })

  describe('################ Get My Activity ################', () => {
    describe('if user not logged in', () => {
      it('Try request get, should return a statusCode 403, forbidden', async () => {
        await supertest(app).get('/activity/me').expect(403)
      })
    })

    describe('if user is already logged in', () => {
      it('Try request get, should return a statusCode 200, OK', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const resultReq = await supertest(app)
          .get('/activity/me')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
      })
    })
  })

  describe('################ Get Activity By ID ################', () => {
    describe('if user not logged in', () => {
      it('Try request get, should return a statusCode 403, forbidden', async () => {
        const result: any = await findActivityFromDB()
        await supertest(app).get(`/activity/${result[0].uuid}`).expect(403)
      })
    })

    describe('if user is already logged in', () => {
      it('Try request get, should return a statusCode 200, OK', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const result: any = await findActivityFromDB()
        const resultReq = await supertest(app)
          .get(`/activity/${result[0].uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
      })
    })
  })

  // DELETE
  describe('################ Delete Activity By ID ################', () => {
    describe('if user not logged in', () => {
      it('Try request get, should return a statusCode 403, forbidden', async () => {
        const result: any = await findActivityFromDB()
        await supertest(app).delete(`/activity/${result[0].uuid}`).expect(403)
      })
    })

    describe('if user is already logged in as admin', () => {
      it('Try request get, should return a statusCode 200, OK', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const result: any = await findActivityFromDB()
        const resultReq = await supertest(app)
          .delete(`/activity/${result[0].uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
      })
    })
  })
})
