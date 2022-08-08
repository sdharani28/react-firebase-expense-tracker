import React, { Fragment, useState, useEffect, useContext } from 'react';
import { FirebaseContext } from './firebase/firebase';

import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TransactionList';
import { AddTransaction } from './components/AddTransaction';

import './App.css';

function App() {
    const { api } = useContext(FirebaseContext);
    
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            const expenses = await api.getExpenses();
            setTransactions(expenses);
        }
        fetchExpenses();
    }, []);

    const addTransaction = async (transaction) => {
        const docId = await api.addExpense(transaction.text, transaction.amount);
        const tempTransactions = [...transactions, {...transaction, id: docId}];
        setTransactions(tempTransactions);
    };

    const deleteTransaction = async (id) => {
        const docId = await api.deleteExpense(id);
        const tempTransactions = transactions.filter(transaction => transaction.id !== id  );
        setTransactions(tempTransactions);
    };

    return (
        <Fragment>
            <Header />
            <div className="container">
                <Balance transactions={transactions}/>
                <IncomeExpenses transactions={transactions}/>
                <TransactionList transactions={transactions} deleteTransaction={deleteTransaction}/>
                <AddTransaction addTransaction={addTransaction}/>
            </div>
        </Fragment>
    );
}

export default App;
