// import { Strategy as LocalStrategy } from 'passport-local'
// import passport from 'passport'
// import { profileModel } from '../models/Profile'

// passport.use(
//     new LocalStrategy(async (username, password, done) => {
//         const user = await profileModel.getProfileByName(username)
//         if (!user) {
//             console.log('No User found with the name ' + username)
//             return done(null, false)
//         }
//         if (user.password != password) {
//             return done(null, false)
//         }
//         return done(null, user)
//     })
// )

// passport.serializeUser((user: any, done) => {
//     done(null, user.id)
// })

// passport.deserializeUser(async (id: string, done) => {
//     const userId = parseInt(id)
//     try {
//         const result = await profileModel.getProfileById(userId)
//         done(null, result)
//     } catch (error) {
//         done(error)
//     }
// })
