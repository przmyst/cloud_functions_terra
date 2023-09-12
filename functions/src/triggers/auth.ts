// @ts-nocheck
import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import {
    toLower,
    trim
} from 'ramda'

import {getAuth} from "firebase-admin/auth";

import crypto from "crypto";

import {bech32} from "bech32";

import {verifyBytes} from "@terra-money/wallet-provider";

function publicKeyToAddress(publicKey) {
    let sha256 = crypto.createHash('sha256').update(publicKey).digest()
    let ripemd160 = crypto.createHash('ripemd160').update(sha256).digest()
    let words = bech32.toWords(ripemd160)
    let address = bech32.encode('terra', words)

    return address
}
const BYTES = Buffer.from('Sign this message to login')
function verifySigner(signedBytes) {

    if(verifyBytes(BYTES, signedBytes)){
        let publicKeyBuffer = Buffer.from(JSON.parse(signedBytes.public_key).key, 'base64')
        return publicKeyToAddress(publicKeyBuffer)
    }else{
        throw Error('Unable to verify signer')
    }
}

export default functions.firestore.document('connections/{codeId}').onCreate(async (snap, context) => {
    let codeId = trim(context.params.codeId)
    let data = snap.data()

    try {
        const verifiedAddress = verifySigner(data)

        const customToken = await getAuth().createCustomToken(toLower(verifiedAddress))

        await admin
            .firestore()
            .collection('codes')
            .doc(codeId)
            .set({
                token: customToken
            })

        await admin
            .firestore()
            .collection('connections')
            .doc(codeId)
            .delete()

        await admin
            .firestore()
            .collection('entity')
            .doc(toLower(verifiedAddress))
            .set({
                last_activity: Date.now()
            }, {
                merge: true
            })

        await delayP(60000)

        await admin
            .firestore()
            .collection('codes')
            .doc(codeId)
            .delete()

    } catch (e) {
        console.error(e)
    }

    return true
})
