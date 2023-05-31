"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const profiles_1 = __importDefault(require("./routes/profiles/profiles"));
const index_1 = __importDefault(require("./routes/index"));
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const passport_1 = __importDefault(require("passport"));
const Profile_1 = require("./models/Profile");
const passport_local_1 = require("passport-local");
const app = (0, express_1.default)();
const pgSessionStore = new ((0, connect_pg_simple_1.default)(express_session_1.default))({
    pool: database_1.default,
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: 'supersecretkey',
    saveUninitialized: true,
    resave: false,
    store: pgSessionStore,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Profile_1.profileModel.getProfileByName(username);
    if (!user) {
        console.log('No User found with the name ' + username);
        return done(null, false);
    }
    if (user.password != password) {
        console.log('user found');
        return done(null, false);
    }
    console.log('Authentication successful for user');
    console.log(user);
    return done(null, user);
})));
passport_1.default.serializeUser((user, done) => {
    console.log('Serialize User');
    done(null, user.profile_id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Deserialize user');
    const userId = parseInt(id);
    try {
        const result = yield Profile_1.profileModel.getProfileById(userId);
        done(null, result);
    }
    catch (error) {
        done(error);
    }
}));
app.use('/profiles', profiles_1.default);
app.use('/', index_1.default);
const port = 3000;
app.listen(port, () => {
    console.log('server started');
});
