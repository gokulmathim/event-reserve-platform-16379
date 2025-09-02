const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../models/store');

const TOKEN_TTL = process.env.JWT_EXPIRES_IN || '1d';

/**
 * AuthService handles user registration, login, and token issuance.
 */
class AuthService {
  // PUBLIC_INTERFACE
  /**
   * Registers a new user.
   * @param {{name:string,email:string,password:string,role?:'user'|'organizer'}} payload
   * @returns {{user: object, token: string}}
   */
  register(payload) {
    const { name, email, password, role = 'user' } = payload;
    if (!name || !email || !password) {
      throw new Error('Missing required fields');
    }
    const existing = store.findUserByEmail(email);
    if (existing) {
      const err = new Error('Email already in use');
      err.status = 409;
      throw err;
    }
    const passwordHash = bcrypt.hashSync(password, 10);
    const user = store.createUser({ name, email, passwordHash, role });
    const token = this._issueToken(user);
    return { user: this._publicUser(user), token };
  }

  // PUBLIC_INTERFACE
  /**
   * Logs in a user with email/password.
   * @param {{email:string,password:string}} payload
   * @returns {{user: object, token: string}}
   */
  login(payload) {
    const { email, password } = payload;
    const user = store.findUserByEmail(email || '');
    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }
    const ok = bcrypt.compareSync(password || '', user.passwordHash);
    if (!ok) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }
    const token = this._issueToken(user);
    return { user: this._publicUser(user), token };
  }

  // PUBLIC_INTERFACE
  /**
   * Returns the currently authenticated user's profile from payload.
   */
  me(userPayload) {
    const user = store.findUserById(userPayload.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    return this._publicUser(user);
  }

  _issueToken(user) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const err = new Error('Server misconfiguration: JWT_SECRET not set');
      err.status = 500;
      throw err;
    }
    return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, secret, { expiresIn: TOKEN_TTL });
  }

  _publicUser(user) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}

module.exports = new AuthService();
