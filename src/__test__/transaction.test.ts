import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import createServer from '../utils/server'
import { createUser, createUserAccess, createUserContact } from '../services/user.service'
import { timestamps } from '../utils/date'
import { hashing } from '../utils/hashing'
import menuCode from '../utils/menuCodeGenerate'
import { createMenu, createMenuType } from '../services/menu.service'
import { findTransaction } from '../services/transaction.service'

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

const {
  createPayloadUserMachine,
  createPayloadUserKitchen,
  createPayloadUserCashier,
  createPayloadUserManager,
  createPayloadUserRegular,
  userManager,
  userKitchen,
  userCashier,
  userMachine
} = {
  // User
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
  createPayloadUserKitchen: {
    firstname: 'Kitchen',
    lastname: '',
    username: 'kitchen123',
    password: 'kitchen123',
    userAccess: { role: 'kitchen' },
    userContact: {
      email: 'kitchen@gmail.com',
      phone: '08123141412'
    },
    profileImage: 'helloworld.png'
  },
  createPayloadUserCashier: {
    firstname: 'Cashier',
    lastname: '',
    username: 'cashier123',
    password: 'cashier123',
    userAccess: { role: 'cashier' },
    userContact: {
      email: 'cashier@gmail.com',
      phone: '08123141412'
    },
    profileImage: 'helloworld.png'
  },
  createPayloadUserMachine: {
    firstname: 'Buying',
    lastname: 'Machine',
    username: 'machine123',
    password: 'machine123',
    userAccess: { role: 'machine' },
    userContact: {
      email: 'machine@gmail.com',
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
  userManager: {
    username: 'manager123',
    password: 'manager123'
  },
  userKitchen: {
    username: 'kitchen123',
    password: 'kitchen123'
  },
  userCashier: {
    username: 'cashier123',
    password: 'cashier123'
  },
  userMachine: {
    username: 'machine123',
    password: 'machine123'
  }
}

const { menuPayload1, menuPayload2 } = {
  menuPayload1: {
    name: 'Americano',
    price: 15000,
    type: {
      category: 'Drinks',
      subCategory: 'Coffee'
    }
  },
  menuPayload2: {
    name: 'Espresso',
    price: 12000,
    type: {
      category: 'Drinks',
      subCategory: 'Coffee'
    }
  }
}

const createMenuPayload = (data: any) => {
  const menuid = new mongoose.Types.ObjectId()
  const typeid = new mongoose.Types.ObjectId()

  data._id = menuid
  data.uuid = uuidv4()
  data.menuCode = menuCode()
  data.menuType = typeid
  data.createdAt = timestamps()
  data.updatedAt = timestamps()

  data.type._id = typeid
  data.type.uuid = uuidv4()
  data.type.menu = menuid
  data.type.createdAt = timestamps()
  data.type.updatedAt = timestamps()

  return data
}

const manager: any = createUserPayload(createPayloadUserManager)
const kitchen: any = createUserPayload(createPayloadUserKitchen)
const cashier: any = createUserPayload(createPayloadUserCashier)
const machine: any = createUserPayload(createPayloadUserMachine)
const regular: any = createUserPayload(createPayloadUserRegular)

const menu1: any = createMenuPayload(menuPayload1)
const menu2: any = createMenuPayload(menuPayload2)

const { transaction1 } = {
  transaction1: {
    customer: 'Hello World',
    orders: [
      { uuid: `${menu1.uuid}`, qty: 2 },
      { uuid: `${menu2.uuid}`, qty: 1 }
    ]
  }
}

describe('**************** Transaction ****************', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())

    // Manager
    await createUser(manager)
    await createUserAccess(manager.userAccess)
    await createUserContact(manager.userContact)

    // Kitchen
    await createUser(kitchen)
    await createUserAccess(kitchen.userAccess)
    await createUserContact(kitchen.userContact)

    // Cashier
    await createUser(cashier)
    await createUserAccess(cashier.userAccess)
    await createUserContact(cashier.userContact)

    // Machine
    await createUser(machine)
    await createUserAccess(machine.userAccess)
    await createUserContact(machine.userContact)

    // Regular
    await createUser(regular)
    await createUserAccess(regular.userAccess)
    await createUserContact(regular.userContact)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  it('Prepare data menu', async () => {
    await createMenu(menu1)
    await createMenuType(menu1.type)
    await createMenu(menu2)
    await createMenuType(menu2.type)
  })

  // CREATE
  describe('################ Create Transaction ################', () => {
    describe('if user not logged in', () => {
      it('Try request post, should return a statusCode 403, forbidden', async () => {
        await supertest(app).post('/transaction').send(transaction1)
      })
    })

    describe('if user is already logged in as Machine', () => {
      it('Try request post, should return a statusCode 201, Created', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userMachine)
        const resultReq = await supertest(app)
          .post('/transaction')
          .send(transaction1)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('Created')
        expect(resultReq.body.statusCode).toBe(201)
        expect(resultReq.statusCode).toBe(201)
      })
    })
    describe('if user is already logged in as Admin or Manager', () => {
      it('Try request post, should return a statusCode 403, forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        await supertest(app)
          .post('/transaction')
          .send(transaction1)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(403)
      })
    })
  })

  // READ
  describe('################ Get Transaction ################', () => {
    describe('if user not logged in', () => {
      it('Try request get, should return a statusCode 403, forbidden', async () => {
        await supertest(app).get('/transaction').expect(403)
      })
    })
    describe('if user is already logged in as Admin or Manager', () => {
      it('Try request get, should return a statusCode 200, OK', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        const resultReq = await supertest(app)
          .get('/transaction')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.body.result.length > 0).toBe(true)
        expect(resultReq.statusCode).toBe(200)
      })
    })
    describe('if user is already logged in as Regular or Machine', () => {
      it('Try request get, should return a statusCode 403, forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userMachine)
        await supertest(app).get('/transaction').set('Authorization', `Bearer ${body.result.accessToken}`).expect(403)
      })
    })
  })

  describe('################ Get Transaction By ID ################', () => {
    describe('if user not logged in', () => {
      it('Try request get, should return a statusCode 403, forbidden', async () => {
        const result: any = await findTransaction()
        await supertest(app).get(`/transaction/${result[0].uuid}`)
      })
    })

    describe('if user is already logged in', () => {
      it('Try request get, should return a statusCode 200, OK with correct params', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        const result: any = await findTransaction()
        const resultReq = await supertest(app)
          .get(`/transaction/${result[0].uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.result.uuid).toBe(result[0].uuid)
      })
      it('Try request get, should return a statusCode 404, data not found with wrong params', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        const resultReq = await supertest(app)
          .get('/transaction/wrong-uuid')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe(false)
        expect(resultReq.body.statusCode).toBe(404)
        expect(resultReq.statusCode).toBe(404)
      })
    })
  })

  describe('################ Get My Transaction ################', () => {
    describe('if user not logged in', () => {
      it('Try request get, should return a statusCode 403, forbidden', async () => {
        await supertest(app).get('/transaction/me').expect(403)
      })
    })

    describe('if user is already logged in as Machine', () => {
      it('Try request get, should return a statusCode 200, OK', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userMachine)
        const resultReq = await supertest(app)
          .get('/transaction/me')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.result.length > 0).toBe(true)
      })
    })

    describe('if user is already logged in as Admin or Manager', () => {
      it('Try request get, should return a statusCode 403, forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        await supertest(app)
          .get('/transaction/me')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(403)
      })
    })
  })

  // UPDATE
  describe('################ Update Transaction By ID ################', () => {
    describe('if user not logged in', () => {
      it('Try request put, should return a statusCode 403, forbidden', async () => {
        const result: any = await findTransaction()
        await supertest(app).put(`/transaction/${result[0].uuid}`).send({ orderStatus: 'Done' })
      })
    })

    describe('if user is already logged in as cashier', () => {
      it('Try request put, should return a statusCode 200, OK with sending orderStatus Prepare', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userCashier)
        const result: any = await findTransaction()
        const resultReq = await supertest(app)
          .put(`/transaction/${result[0].uuid}`)
          .send({ orderStatus: 'Prepare' })
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
      })
    })

    describe('if user is already logged in as kitchen', () => {
      it('Try request put, should return a statusCode 200, OK with sending orderStatus Done', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userKitchen)
        const result: any = await findTransaction()
        const resultReq = await supertest(app)
          .put(`/transaction/${result[0].uuid}`)
          .send({ orderStatus: 'Done' })
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
      })
    })
  })

  // DELETE
  describe('################ Delete Transaction By ID ################', () => {
    describe('if user not logged in', () => {
      it('Try request delete, should return a statusCode 403, forbidden', async () => {
        const result: any = await findTransaction()
        await supertest(app).delete(`/transaction/${result[0].uuid}`).expect(403)
      })
    })
    describe('if user is already logged in as Manager', () => {
      it('Try request delete, should return a statusCode 200, OK with correct params', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        const result: any = await findTransaction()
        const resultReq = await supertest(app)
          .delete(`/transaction/${result[0].uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe('OK')
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
      })
    })
    describe('if user is already logged in as Manager', () => {
      it('Try request delete, should return a statusCode 404, with wrong params', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        const resultReq = await supertest(app)
          .delete('/transaction/wrong-uuid')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.body.status).toBe(false)
        expect(resultReq.body.statusCode).toBe(404)
        expect(resultReq.statusCode).toBe(404)
      })
    })
  })
})
