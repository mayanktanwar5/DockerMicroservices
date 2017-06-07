/**
 * Created by Mak on 6/5/17.
 */

module.exports = {
    db: {
        host: process.env.DATABASE_HOST || '127.0.0.1',
        database: 'test',
        user: 'user_service',
        password: '123',
        port: 3306
    }
};
