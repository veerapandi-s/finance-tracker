// app/lib/api.ts

export async function fetchTransactions(month: string) {
    const response = await fetch(`/api/transactions?month=${month}`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
}

export async function createTransaction(data: any) {
    const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create transaction');
    return response.json();
}

export async function updateTransaction(id: number, data: any) {
    const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update transaction');
    return response.json();
}

export async function deleteTransaction(id: number) {
    const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete transaction');
    return response.json();
}
