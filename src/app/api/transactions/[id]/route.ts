// app/api/transactions/[id]/route.ts
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const {
            date,
            type,
            category,
            amount,
            payment_method,
            bank_account,
            credit_card,
            person,
            description
        } = body;

        const query = `
            UPDATE transactions 
            SET date = $1,
                type = $2,
                category = $3,
                amount = $4,
                payment_method = $5,
                bank_account = $6,
                credit_card = $7,
                person = $8,
                description = $9
            WHERE id = $10 AND user_id = $11
            RETURNING *
        `;

        const values = [
            date,
            type,
            category,
            amount,
            payment_method,
            bank_account,
            credit_card,
            person,
            description,
            params.id,
            1 // Replace with actual user_id
        ];

        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating transaction:', error);
        return NextResponse.json(
            { error: 'Failed to update transaction' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const query = 'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *';
        const result = await pool.query(query, [params.id, 1]); // Replace 1 with actual user_id

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return NextResponse.json(
            { error: 'Failed to delete transaction' },
            { status: 500 }
        );
    }
}
