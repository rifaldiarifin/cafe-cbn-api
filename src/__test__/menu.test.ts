import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { timestamps } from '../utils/date'
import createServer from '../utils/server'
import { createUser, createUserAccess, createUserContact } from '../services/user.service'
import { hashing } from '../utils/hashing'
import menuCode from '../utils/menuCodeGenerate'
import { createMenu, createMenuType } from '../services/menu.service'

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

const {
  createPayloadUserAdmin,
  createPayloadUserMachine,
  createPayloadUserManager,
  createPayloadUserRegular,
  userAdmin,
  userManager,
  userMachine,
  userRegular
} = {
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
  userAdmin: {
    username: 'admin123',
    password: 'admin123'
  },
  userManager: {
    username: 'manager123',
    password: 'manager123'
  },
  userMachine: {
    username: 'machine123',
    password: 'machine123'
  },
  userRegular: {
    username: 'regular123',
    password: 'regular123'
  }
}

const { menuPayload1, menuPayload2, menuPayload3, menuPayload4, menuPayload5, menuPayload6, updateMenuPayload } = {
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
  },
  menuPayload3: {
    name: 'Caramel Latte',
    price: 23000,
    type: {
      category: 'Drinks',
      subCategory: 'Coffee'
    }
  },
  menuPayload4: {
    name: 'Cappuchino',
    price: 18000,
    type: {
      category: 'Drinks',
      subCategory: 'Coffee'
    }
  },
  menuPayload5: {
    name: 'Mocha',
    price: 20000,
    type: {
      category: 'Drinks',
      subCategory: 'NonCoffee'
    }
  },
  menuPayload6: {
    name: 'Black Charcoal',
    price: 26000,
    type: {
      category: 'Drinks',
      subCategory: 'NonCoffee'
    }
  },
  updateMenuPayload: {
    name: 'Black Forest',
    price: 42000,
    type: {
      category: 'Deserts',
      subCategory: 'Cake'
    }
  }
}

const admin: any = createUserPayload(createPayloadUserAdmin)
const manager: any = createUserPayload(createPayloadUserManager)
const machine: any = createUserPayload(createPayloadUserMachine)
const regular: any = createUserPayload(createPayloadUserRegular)

const newMenu: any = createMenuPayload(menuPayload5)
const newMenu2: any = createMenuPayload(menuPayload6)

const { ratePayload1, updateRatePayload1 } = {
  ratePayload1: {
    uuidMenu: newMenu.uuid,
    ratings: {
      rate: 5,
      comment: 'Good Coffee'
    }
  },
  updateRatePayload1: {
    rate: 4,
    comment: 'Not Bad'
  }
}

describe('**************** Menu ****************', () => {
  beforeAll(async () => {
    try {
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

      // Machine
      await createUser(machine)
      await createUserAccess(machine.userAccess)
      await createUserContact(machine.userContact)

      // Regular
      await createUser(regular)
      await createUserAccess(regular.userAccess)
      await createUserContact(regular.userContact)
    } catch (error: any) {
      console.log(`ERROR: Unit Testing - Prepare = ${error.message}`)
    }
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  // Prepare
  it('prepare data', async () => {
    await createMenu(newMenu)
    await createMenuType(newMenu.type)
    await createMenu(newMenu2)
    await createMenuType(newMenu2.type)
  })

  // CREATE
  describe('################ Create Menu ################', () => {
    describe('if user is not logged in', () => {
      it('Try request post, should return a status code 403, forbidden', async () => {
        await supertest(app).post('/menu').send(createMenuPayload(menuPayload1)).expect(403)
      })
    })

    describe('if user is already logged in by Admin', () => {
      it('Try request post, should return a status code 201, by sending new menu data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const resultReq1 = await supertest(app)
          .post('/menu')
          .send(menuPayload1)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq1.body.statusCode).toBe(201)
        expect(resultReq1.statusCode).toBe(201)
        await supertest(app)
          .post('/menu')
          .send(menuPayload2)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(201)
      })
    })
    describe('if user is already logged in by Manager', () => {
      it('Try request post, should return a status code 201, by sending new menu data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        const resultReq1 = await supertest(app)
          .post('/menu')
          .send(menuPayload3)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq1.body.statusCode).toBe(201)
        expect(resultReq1.statusCode).toBe(201)
        await supertest(app)
          .post('/menu')
          .send(menuPayload4)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(201)
      })
    })
    describe('if user is already logged in by Machine', () => {
      it('Try request post, should return a status code 403, forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userMachine)
        await supertest(app)
          .post('/menu')
          .send(menuPayload5)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(403)
      })
    })
    describe('if user is already logged in by Regular', () => {
      it('Try request post, should return a status code 403, forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        await supertest(app)
          .post('/menu')
          .send(menuPayload5)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(403)
      })
    })
  })

  describe('################ Rate the Menu ################', () => {
    describe('if user is not logged in', () => {
      it('Try request post, should return a status code 403, forbidden', async () => {
        await supertest(app).post('/menu/rate').send(ratePayload1).expect(403)
      })
    })

    describe('if user is already logged in', () => {
      it('Try request post, should return a status code 201', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const resultReq1 = await supertest(app)
          .post('/menu/rate')
          .send(ratePayload1)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(201)
        expect(resultReq1.body.statusCode).toBe(201)
        expect(resultReq1.statusCode).toBe(201)
      })
    })
  })

  // READ
  describe('################ Get All Menu ################', () => {
    describe('if user is not logged in', () => {
      it('Try request get, should return a status code 403, forbidden', async () => {
        await supertest(app).get('/menu').expect(403)
      })
    })

    describe('if user is already logged in by Admin', () => {
      it('Try request get, should return a status code 200, with data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const resultReq = await supertest(app).get('/menu').set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.result.length > 0).toBe(true)
      })
    })
    describe('if user is already logged in by Manager', () => {
      it('Try request get, should return a status code 200, with data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        const resultReq = await supertest(app).get('/menu').set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.result.length > 0).toBe(true)
      })
    })
    describe('if user is already logged in by Machine', () => {
      it('Try request get, should return a status code 200, with data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userMachine)
        const resultReq = await supertest(app).get('/menu').set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.result.length > 0).toBe(true)
      })
    })
    describe('if user is already logged in by Regular', () => {
      it('Try request get, should return a status code 200, with data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const resultReq = await supertest(app).get('/menu').set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.result.length > 0).toBe(true)
      })
    })
  })

  describe('################ Get Detail Menu ################', () => {
    describe('if user is not logged in', () => {
      it('Try request get, should return a status code 403, forbidden', async () => {
        const menuId = 'menu1ze'
        await supertest(app).get(`/menu/${menuId}`).expect(403)
      })
    })

    describe('if user is already logged in by Admin', () => {
      it('Try request get but with wrong key, should return a status code 404, and data is empty', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const menuId = 'menu1ze'
        await supertest(app)
          .get(`/menu/${menuId}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(404)
      })

      it('tried to prompt but with correct uuid, should return a status code 200, and data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const resultReq = await supertest(app)
          .get(`/menu/${newMenu.uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.result.uuid).toBe(newMenu.uuid)
      })
    })
    describe('if user is already logged in by Manager', () => {
      it('Try request get but with wrong key, should return a status code 404, and data is empty', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        const menuId = 'menu1ze'
        await supertest(app)
          .get(`/menu/${menuId}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(404)
      })

      it('tried to prompt but with correct uuid, should return a status code 200, and data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)

        const resultReq = await supertest(app)
          .get(`/menu/${newMenu.uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.result.uuid).toBe(newMenu.uuid)
      })
    })
    describe('if user is already logged in by Machine', () => {
      it('Try request get but with wrong key, should return a status code 404, and data is empty', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userMachine)
        const menuId = 'menu1ze'
        await supertest(app)
          .get(`/menu/${menuId}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(404)
      })

      it('tried to prompt but with correct uuid, should return a status code 200, and data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userMachine)
        const resultReq = await supertest(app)
          .get(`/menu/${newMenu.uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.result.uuid).toBe(newMenu.uuid)
      })
    })
    describe('if user is already logged in by Regular', () => {
      it('Try request get but with wrong key, should return a status code 404, and data is empty', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const menuId = 'menu1ze'
        await supertest(app)
          .get(`/menu/${menuId}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(404)
      })

      it('tried to prompt but with correct uuid, should return a status code 200, and data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const resultReq = await supertest(app)
          .get(`/menu/${newMenu.uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.result.uuid).toBe(newMenu.uuid)
      })
    })
  })

  describe('################ Get Rating By User ################', () => {
    describe('if user is not logged in', () => {
      it('Try request get, should return a status code 403, forbidden', async () => {
        await supertest(app).get('/menu/rate/user').expect(403)
      })
    })

    describe('if user is already logged in', () => {
      it('Try request get, should return a status code 200, with data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const resultReq = await supertest(app)
          .get('/menu/rate/user')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.result.length > 0).toBe(true)
      })
    })
  })

  // UPDATE
  describe('################ Update Menu ################', () => {
    describe('if user is not logged in', () => {
      it('Try request update, should return a status code 403, forbidden', async () => {
        await supertest(app).put(`/menu/${newMenu.uuid}`).send(updateMenuPayload).expect(403)
      })
    })
    describe('if user is already logged in by Admin', () => {
      it('Try request update, should return a status code 200, by sending new menu data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const resultReq = await supertest(app)
          .put(`/menu/${newMenu.uuid}`)
          .send(updateMenuPayload)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(200)
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
      })
    })
    describe('if user is already logged in by Manager', () => {
      it('Try request update, should return a status code 200, by sending new menu data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        const resultReq = await supertest(app)
          .put(`/menu/${newMenu.uuid}`)
          .send(updateMenuPayload)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(200)
        expect(resultReq.body.statusCode).toBe(200)
        expect(resultReq.statusCode).toBe(200)
      })
    })
    describe('if user is already logged in by Machine', () => {
      it('Try request update, should return a status code 403, forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userMachine)
        await supertest(app)
          .put(`/menu/${newMenu.uuid}`)
          .send(updateMenuPayload)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(403)
      })
    })
    describe('if user is already logged in by Regular', () => {
      it('Try request update, should return a status code 403, forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        await supertest(app)
          .put(`/menu/${newMenu.uuid}`)
          .send(updateMenuPayload)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(403)
      })
    })

    it('Try request update, should return a status code 404, by sending new menu data', async () => {
      const { body } = await supertest(app).post('/auth/login').send(userAdmin)
      const resultReq = await supertest(app)
        .put('/menu/wrong-uuid')
        .send(updateMenuPayload)
        .set('Authorization', `Bearer ${body.result.accessToken}`)
        .expect(404)
      expect(resultReq.body.statusCode).toBe(404)
      expect(resultReq.statusCode).toBe(404)
    })
  })

  describe('################ Update Rate of Menu ################', () => {
    describe('if user is not logged in', () => {
      it('Try request post, should return a status code 403, forbidden', async () => {
        await supertest(app).put(`/menu/rate${newMenu.uuid}`).send(updateRatePayload1).expect(403)
      })
    })

    describe('if user is already logged in', () => {
      it('Try request post, should return a status code 200, with sending data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const resultReq1 = await supertest(app)
          .get('/menu/rate/user')
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        const resultReq2 = await supertest(app)
          .put(`/menu/rate/${resultReq1.body.result[0].uuid}`)
          .send(updateRatePayload1)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(200)

        expect(resultReq2.body.statusCode).toBe(200)
      })
      it('Try request post, should return a status code 404, with sending data', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        const resultReq2 = await supertest(app)
          .put('/menu/rate/wrong-uuid')
          .send(updateRatePayload1)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(404)

        expect(resultReq2.body.statusCode).toBe(404)
      })
    })
  })

  // DELETE
  describe('################ Delete Menu ################', () => {
    describe('if user is not logged in', () => {
      it('Try request delete, should return a status code 403, forbidden', async () => {
        await supertest(app).delete(`/menu/${newMenu.uuid}`).expect(403)
      })
    })

    describe('if user is already logged in by Admin', () => {
      it('Try request delete, should return a status code 200, param uuid', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin)
        const resultReq = await supertest(app)
          .delete(`/menu/${newMenu.uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.statusCode).toBe(200)
      })
    })
    describe('if user is already logged in by Manager', () => {
      it('Try request delete, should return a status code 200, param uuid', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userManager)
        const resultReq = await supertest(app)
          .delete(`/menu/${newMenu2.uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
        expect(resultReq.statusCode).toBe(200)
        expect(resultReq.body.statusCode).toBe(200)
      })
    })
    describe('if user is already logged in by Machine', () => {
      it('Try request delete, should return a status code 403, param uuid', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userMachine)
        await supertest(app)
          .delete(`/menu/${newMenu.uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(403)
      })
    })
    describe('if user is already logged in by Regular', () => {
      it('Try request delete, should return a status code 403, param uuid', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular)
        await supertest(app)
          .delete(`/menu/${newMenu.uuid}`)
          .set('Authorization', `Bearer ${body.result.accessToken}`)
          .expect(403)
      })
    })

    it('Try request delete, should return a status code 404, param uuid', async () => {
      const { body } = await supertest(app).post('/auth/login').send(userAdmin)
      const resultReq = await supertest(app)
        .delete('/menu/wrong-uuid')
        .set('Authorization', `Bearer ${body.result.accessToken}`)
      expect(resultReq.statusCode).toBe(404)
      expect(resultReq.body.statusCode).toBe(404)
    })
  })
})
