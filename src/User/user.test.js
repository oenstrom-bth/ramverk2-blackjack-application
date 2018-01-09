const mongoClient = require("mongodb").MongoClient;
const User = require("./user");
const userData = [
    {
        "username": "test",
        "email": "test@test.com",
        "password": "37aa1e6cbe05c9712ce390effcb7c9b7b3d75d422a1d880a74c801d86b10236f1b21aa397152ab651d1dbb9568e13979bacdd27e0b0cc6c4ec49b721f1435034",
        "salt": "41ef455fd446d64c",
        "money": 1000
    },
    {
        "username": "test2",
        "email": "test2@test.com",
        "password": "83bbf53894a77677f13d6fc234aadbf87063753f88b351c35a0b5e2d65a0b38ff232466cb05299b55f7d181f7aa4a3c4eb3bdd3cdcd06c5cc9bd936447ca9cef",
        "salt": "baec9f4d33b32aa4",
        "money": 1000
    },
    {
        "username": "test3",
        "email": "test3@test.com",
        "password": "509509198b99d4607924d2205702cdc3757ed906a1296817d51ebd5a60fde616d979c8829ca5715504811b4e35ce5d2d579e373b40335671fda38f0e4df10a02",
        "salt": "fca9bde2ce5ca46f",
        "money": 1000
    },
    {
        "username": "test4",
        "email": "test4@test.com",
        "password": "a5cb57aab096f3aa4ade65545cf7982abcdf0aa793593039cca8effd0a9d72b7d83361203568f1c926e55ed4263779301095d8cd762bf254508e9be2ffd7ce34",
        "salt": "83952df75428bf6b",
        "money": 1000
    }
];

let db;

// const coll = await db.collection(collName);
// await coll.deleteMany();
// await coll.insertMany(doc);
// await db.close();

beforeEach((done) => {
    mongoClient.connect("mongodb://localhost:27017/test", (error, database) => {
        db = database;
        db.collection("users", (err, coll) => {
            coll.insertMany(userData, () => {
                done();
            });
        });
    });
});

afterEach((done) => {
    db.collection("users", (err, coll) => {
        coll.remove({}, () => {
            db.close();
            done();
        });
    });
});

// test("awdawdawd", done => {
//     db.collection("users", (err, coll) => {
//         coll.findOne({username: "test"}, {fields: {username: 1}}, (err, doc) => {
//             console.log(doc);
//             expect(doc.username).toEqual("test");
//             done();
//         });
//     });
// });

test("test create user object", async () => {
    const user = await new User(db);

    expect(user).toBeInstanceOf(User);
    expect(user.coll).not.toBeUndefined();
});

test("test userExist()", async () => {
    const user = await new User(db, "users");

    expect(await user.userExist("test", "test@test.com")).toBeTruthy();
    expect(await user.userExist("test10", "test10@test.com")).toBeFalsy();
});

test("test register()", async () => {
    const user = await new User(db, "users");

    expect(await user.register({
        username: "test(",
        email: "test10@test.com",
        password: "testpassword"
    })).toEqual({
        status: 400,
        error: {
            field: "username",
            message: "'username' only accepts alphanumeric characters.",
            type: "JString:alphanum"
        }
    });

    expect(await user.register({
        username: "test",
        email: "test@test.com",
        password: "testpassword"
    })).toEqual({
        status: 400,
        error: {
            type: "user:exist",
            field: "username|email",
            message: "That user does already exist."
        }
    });

    expect(await user.register({
        username: "test10",
        email: "test10@test.com",
        password: "testpassword"
    })).toEqual(expect.objectContaining({
        status: 200,
        username: "test10",
        email: "test10@test.com",
        password: expect.any(String),
        salt: expect.any(String),
        error: null
    }));
    expect(await user.userExist("test10", "test10@test.com")).toBeTruthy();
});

test("test login()", async () => {
    const user = new User(db, "users");

    expect(await user.login({
        username: "test",
        password: "test"
    })).toEqual({
        status: 400,
        error: {
            field: "password",
            message: "'password' has a minimum required length of '6'.",
            type: "JString:min"
        }
    });

    expect(await user.login({
        username: "test10",
        password: "password"
    })).toEqual({
        status: 400,
        error: {
            type: "credentials:invalid",
            field: "username|password",
            message: "Invalid user credentials."
        }
    });

    expect(await user.login({
        username: "test",
        password: "invalidpassword"
    })).toEqual({
        status: 400,
        error: {
            type: "credentials:invalid",
            field: "username|password",
            message: "Invalid user credentials."
        }
    });

    expect(await user.login({
        username: "test",
        password: "password"
    })).toEqual({
        status: 200,
        token: expect.any(String),
        user: {username: "test", email: "test@test.com"},
        error: null
    });
});
