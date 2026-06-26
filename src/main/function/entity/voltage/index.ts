import db from '../../datacontext/index.js'
import { insertVoltageTransaction, getVoltageById, deleteVoltageByIdTransaction } from '@/function/cim/voltage';
import { insertBaseVoltageTransaction, getBaseVoltageById, deleteBaseVoltageByIdTransaction } from '@/function/cim/baseVoltage';
import { insertVoltageLevelTransaction, getVoltageLevelById, deleteVoltageLevelByIdTransaction } from '@/function/cim/voltageLevel';
import { deleteBayByIdTransaction, getBayByVoltageLevelOrSubstation } from '@/function/cim/bay';

export const insertVoltageLevelEntity: any = async (entity: any) => {
    try {
        if (entity.voltageLevel.mrid) {
            await runAsync('BEGIN TRANSACTION');

            if (entity.voltage && entity.voltage.length > 0) {
                for (const voltage of entity.voltage) {
                    if (voltage && voltage.mrid) {
                        await insertVoltageTransaction(voltage, db);
                    }
                }
            }

            if (entity.baseVoltage && entity.baseVoltage.mrid) {
                await insertBaseVoltageTransaction(entity.baseVoltage, db);
            }

            await insertVoltageLevelTransaction(entity.voltageLevel, db);

            await runAsync('COMMIT');
            return { success: true, data: entity, message: 'Voltage level entity inserted successfully' };
        } else {
            return { success: false, message: 'Error retrieving voltage entity, id is required' };
        }
    } catch (error: any) {
        console.error('Error retrieving voltage entity:', error);
        await runAsync('ROLLBACK');
        return { success: false, error, message: 'Error retrieving voltage entity' };
    }
}

export const getVoltageLevelEntity: any = async (id: string) => {
    const data: any = {
        voltageLevel: null,
        baseVoltage: null,
        voltage: []
    };

    try {
        const dataVoltageLevel: any = await getVoltageLevelById(id);
        if (!dataVoltageLevel.success) {
            return { success: false, message: 'Error retrieving voltage level entity' };
        }

        data.voltageLevel = dataVoltageLevel.data;

        const baseVoltage: any = await getBaseVoltageById(dataVoltageLevel.data.base_voltage);
        if (baseVoltage.success) {
            data.baseVoltage = baseVoltage.data;

            const voltage: any = await getVoltageById(baseVoltage.data.nominal_voltage);
            if (voltage.success) {
                data.voltage.push(voltage.data);
            }
        }

        const highVoltageLimitData: any = await getVoltageById(dataVoltageLevel.data.high_voltage_limit);
        if (highVoltageLimitData.success) {
            data.voltage.push(highVoltageLimitData.data);
        }

        const lowVoltageLimitData: any = await getVoltageById(dataVoltageLevel.data.low_voltage_limit);
        if (lowVoltageLimitData.success) {
            data.voltage.push(lowVoltageLimitData.data);
        }

        return { success: true, data: data, message: 'Voltage level entity retrieved successfully' };
    } catch (error: any) {
        console.error('Error retrieving voltage level entity:', error);
        return { success: false, error, message: 'Error retrieving voltage level entity' };
    }
}

export const deleteVoltageLevelById: any = async (data: any) => {
    try {
        console.log('Starting delete VoltageLevel:', data.voltageLevel && data.voltageLevel.mrid)
        await runAsync('BEGIN TRANSACTION')

        await deleteChildBays(data.voltageLevel)

        await deleteVoltageLevel(data.voltageLevel)

        await deleteBaseVoltageIfNotUsed(data.baseVoltage)

        await deleteVoltagesIfNotUsed(data.voltage)

        await runAsync('COMMIT');
        console.log('VoltageLevel deleted successfully')
        return { success: true, data: data, message: 'Voltage level deleted successfully' };
    } catch (error: any) {
        await runAsync('ROLLBACK');
        console.error('Error deleting voltage level by id:', error);
        return { success: false, error, message: 'Delete voltage failed' };
    }
}

async function deleteChildBays(voltageLevel: any) {
    if (!voltageLevel || !voltageLevel.mrid) return

    console.log('Checking for child Bays...')
    const baysResult: any = await getBayByVoltageLevelOrSubstation(voltageLevel.mrid, '')

    if (baysResult.success && baysResult.data && baysResult.data.length > 0) {
        console.log(`Found ${baysResult.data.length} child Bay(s), deleting...`)
        for (const bay of baysResult.data) {
            console.log('Deleting Bay:', bay.mrid)
            await deleteBayByIdTransaction(bay.mrid, db)
        }
    } else {
        console.log('No child Bays found')
    }
}

async function deleteVoltageLevel(voltageLevel: any) {
    if (!voltageLevel || !voltageLevel.mrid) return

    console.log('Deleting VoltageLevel:', voltageLevel.mrid)
    await deleteVoltageLevelByIdTransaction(voltageLevel.mrid, db)
}

async function deleteBaseVoltageIfNotUsed(baseVoltage: any) {
    if (!baseVoltage || !baseVoltage.mrid) return

    console.log('Checking if BaseVoltage is used by other VoltageLevels:', baseVoltage.mrid)

    const count: any = await countUsageInTable('voltage_level', 'base_voltage', baseVoltage.mrid)

    if (count === 0) {
        console.log('BaseVoltage not used by others, deleting:', baseVoltage.mrid)
        await deleteBaseVoltageByIdTransaction(baseVoltage.mrid, db)
    } else {
        console.log('BaseVoltage still used by', count, 'other VoltageLevel(s), skipping delete')
    }
}

async function deleteVoltagesIfNotUsed(voltages: any) {
    if (!voltages || voltages.length === 0) return

    console.log(`Checking ${voltages.length} Voltage(s)`)

    for (const voltage of voltages) {
        const usedInVL: any = await countUsageInVoltageLevelTable(voltage.mrid)
        const usedInBV: any = await countUsageInTable('base_voltage', 'nominal_voltage', voltage.mrid)

        if (usedInVL === 0 && usedInBV === 0) {
            console.log('Voltage not used by others, deleting:', voltage.mrid)
            await deleteVoltageByIdTransaction(voltage.mrid, db)
        } else {
            console.log('Voltage still used by others (VL:', usedInVL, ', BV:', usedInBV, '), skipping delete:', voltage.mrid)
        }
    }
}

function countUsageInTable(tableName: string, columnName: string, value: string) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT COUNT(*) as count FROM ${tableName} WHERE ${columnName} = ?`,
            [value],
            (err: any, row: any) => {
                if (err) reject(err)
                else resolve(row.count)
            }
        )
    })
}

function countUsageInVoltageLevelTable(voltageMrid: string) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT COUNT(*) as count FROM voltage_level
             WHERE high_voltage_limit = ? OR low_voltage_limit = ?`,
            [voltageMrid, voltageMrid],
            (err: any, row: any) => {
                if (err) reject(err)
                else resolve(row.count)
            }
        )
    })
}

const runAsync: any = (sql: string, params: any[] = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err: any) {
            if (err) reject(err);
            else resolve(undefined);
        });
    });
};