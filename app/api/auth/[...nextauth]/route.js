import NextAuth from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { get_table_data_by_array, insert_data_in_table } from "@/lib/db";

const handler = NextAuth({
    providers: [
        // OAuth authentication providers...
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                name: { label: "name", type: "text", placeholder: "Roshan Jha" },
                email: { label: "Email", type: "email", placeholder: "example@abc.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = { name: credentials.name, email: credentials.email, password: credentials.password }

                if (user) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Persist the OAuth access_token to the token right after signin
            if (user) {
                token.app_id = user.app_id;
            }
            return token;
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.user.app_id = token.app_id;
            return session;
        },
        async signIn({ user }) {

            let sql = {
                table_name: 'users',
                where_array: {
                    email: user.email
                },
                order_by: 'id'
            }

            let db_response = await get_table_data_by_array(sql)

            let insert_sql

            if (db_response[0].length === 0) {

                if (user.hasOwnProperty('password')) {
                    insert_sql = {
                        table_name: 'users',
                        data: [{
                            name: user.name,
                            email: user.email,
                            password: user.password
                        }]
                    }
                } else {
                    insert_sql = {
                        table_name: 'users',
                        data: [{
                            name: user.name,
                            email: user.email,
                            password: 'NOT SET'
                        }]
                    }
                }

                let insert_db_response = await insert_data_in_table(insert_sql);

                user.app_id = insert_db_response[0].insertId

                return {
                    ...user
                }
            } else {

                user.app_id = db_response[0][0].id
                user.name = db_response[0][0].name

                return {
                    ...user
                }
            }

        }
    }
})

export { handler as GET, handler as POST }