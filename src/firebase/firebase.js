// firebase.js
// contains the Firebase context and provider

import React, { createContext } from 'react'
import firebaseConfig from './firebaseConfig';
import app from 'firebase/compat/app';
import 'firebase/compat/database';

// we create a React Context, for this to be accessible
// from a component later
const FirebaseContext = createContext(null)
export { FirebaseContext }

function FirebaseProvider({ children }) {
    let firebase = {
        app: null,
        database: null,
    }

    // check if firebase app has been initialized previously
    // if not, initialize with the config we saved earlier
    if (!app.apps.length) {
        app.initializeApp(firebaseConfig);
        firebase = {
            app: app,
            database: app.database(),

            api: {
                getExpenses,
                addExpense,
                deleteExpense
            },
        }
    }

    // function to query Expenses from the database
    async function getExpenses() {
        try {
            const snapshot = await firebase.database.ref('expenses').once('value')

            const vals = await snapshot.val();
            let _records = [];
            for (var key in vals) {
                _records.push({
                    ...vals[key],
                    id: key
                });
            }

            return _records;
        } catch (error) {
            console.error(`error while getExpenses :: ${error}`);
        }
    }

    async function addExpense(itemTitle, itemAmount) {
        try {
            const ref = await firebase.database.ref('expenses');
            const res = await ref.push({
                text: itemTitle,
                amount: itemAmount
            });

            const docId = res.getKey();
            return docId;

        } catch (error) {
            console.error(`error while adding transaction :: ${error}`);
        }
    }

    async function deleteExpense(docId){
        try {
            const ref = await firebase.database.ref('expenses');
            await ref.child(docId).remove();
        }catch (error) {
            console.error(`error while deleting expense :: ${error}`);
        }
    }

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    )
}

export default FirebaseProvider;