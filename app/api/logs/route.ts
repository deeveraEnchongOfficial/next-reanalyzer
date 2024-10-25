import { NextRequest, NextResponse } from 'next/server';
import { EventLog } from '@prisma/client';
import { findManyRecords, createRecord } from '@/helpers/dbHelpers';

export async function GET(req: NextRequest) {
    try {
        const logs = await findManyRecords<EventLog>({
            model: 'eventLog',
            include: { user: true },
        });
        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const newLog = await createRecord<EventLog>({
            model: 'eventLog',
            data: { 
                ...body
            },
        });
        return NextResponse.json(newLog, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Error adding log' }, { status: 500 });
    }
}
