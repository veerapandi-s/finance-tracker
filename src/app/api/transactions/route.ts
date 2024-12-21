// app/api/transactions/route.ts

import { NextResponse } from 'next/server';
import pool from '../../lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const month = searchParams.get('month');
        
        // Convert YYYY-MM to YYYY-MM-01 for proper date parsing
        const startDate = `${month}-01`;
        
        const query = `
            SELECT * FROM transactions 
            WHERE user_id = $1
            AND date >= $2::date
            AND date < ($2::date + interval '1 month')
            ORDER BY date DESC
        `;
        
        const result = await pool.query(query, [1, startDate]);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            date,
            type,
            category,
            amount,
            paymentMethod : payment_method ,
            bankAccount : bank_account,
            creditCard : credit_card,
            person,
            description
        } = body;

        const query = `
            INSERT INTO transactions (
                user_id,
                date,
                type,
                category,
                amount,
                payment_method,
                bank_account,
                credit_card,
                person,
                description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

        const values = [
            1, // Replace with actual user_id
            date,
            type,
            category,
            amount,
            payment_method,
            bank_account || null,
            credit_card || null,
            person || null,
            description || null
        ];

        const result = await pool.query(query, values);
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500 }
        );
    }
}