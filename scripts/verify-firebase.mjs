// Creates disposable test users in the configured project; never uses an admin credential.
import { randomBytes } from 'node:crypto';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, deleteUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, deleteDoc, terminate } from 'firebase/firestore';
import { app } from '../src/services/Firebase/Firebase.ts';

const path = new URL('../.verification.local', import.meta.url);
const auth = getAuth(app);
const db = getFirestore(app);
const mode = process.argv[2];
try {
    if (mode === 'setup') {
        const credentials = [];
        for (let index = 0; index < 2; index++) {
            const email = `capy-deploy-${Date.now()}-${index}@example.com`;
            const password = randomBytes(24).toString('base64url');
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, { displayName: 'Capy deployment verification' });
            credentials.push({ email, password, uid: user.uid });
            await writeFile(path, JSON.stringify(credentials), { mode: 0o600 });
            await signOut(auth);
        }
        console.log('PASS: two disposable Firebase Auth users registered; no financial profiles pre-created.');
    } else if (mode === 'verify') {
        const [owner, other] = JSON.parse(await readFile(path, 'utf8'));
        await signInWithEmailAndPassword(auth, owner.email, owner.password);
        const profile = await getDoc(doc(db, 'realUsers', owner.uid));
        if (!profile.exists() || profile.data().userUID !== owner.uid) throw new Error('Own profile was not created by the application');
        console.log('PASS: real profile created by the application and readable by its owner.');
        if (!profile.data().plannedExpenses.some(expense => expense.expenseSite === 'Deployment verification')) throw new Error('UI expense was not persisted');
        console.log('PASS: expense entered through the UI persisted in Firestore.');
        await signInWithEmailAndPassword(auth, other.email, other.password);
        try {
            await getDoc(doc(db, 'realUsers', owner.uid));
            throw new Error('Cross-user access unexpectedly allowed');
        } catch (error) {
            if (error.code !== 'permission-denied') throw error;
            console.log('PASS: cross-user profile access denied.');
        }
        // A separate app avoids reusing authenticated Firestore cache.
        const anonymousApp = initializeApp(app.options, 'verification-anonymous');
        const anonymousDb = getFirestore(anonymousApp);
        try {
            await getDoc(doc(anonymousDb, 'realUsers', owner.uid));
            throw new Error('Anonymous access unexpectedly allowed');
        } catch (error) {
            if (error.code !== 'permission-denied') throw error;
            console.log('PASS: anonymous profile access denied.');
        } finally { await terminate(anonymousDb); await deleteApp(anonymousApp); }
    } else if (mode === 'cleanup') {
        const credentials = JSON.parse(await readFile(path, 'utf8'));
        for (const credential of credentials) {
            const { user } = await signInWithEmailAndPassword(auth, credential.email, credential.password);
            await deleteDoc(doc(db, 'realUsers', user.uid));
            await deleteUser(user);
        }
        await unlink(path);
        console.log('PASS: disposable test profiles, accounts and local credentials removed.');
    } else throw new Error('Use setup, verify or cleanup');
} finally {
    await terminate(db);
    await deleteApp(app);
}
