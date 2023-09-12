// @ts-nocheck
import * as admin from 'firebase-admin'
import 'firebase-functions'
admin.initializeApp()

import auth from './triggers/auth'

export {
	auth
}
