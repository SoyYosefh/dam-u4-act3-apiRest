import Pagos from '../models/pagosModel';
import boom from '@hapi/boom';

export const getPagosList = async () => {
    let PagosList;
    try {
        PagosList = await Pagos.find();
        if (!PagosList) {
            throw boom.notFound('No se encontraron elementos');
        }
        return (PagosList);
    } catch (error) {
        throw boom.internal(error);
    }
};

export const getPagosItem = async (id, keyType) => {
    let PagosItem;
    try {
        if (keyType === 'OK') {
            PagosItem = await Pagos.findOne({
                IdPagoOK: id,
            });
        } else if (keyType === 'BK') {
            PagosItem = await Pagos.findOne({
                IdPagoBK: id,
            });
        } else {
            // Realizar la búsqueda por idPago
            PagosItem = await Pagos.findOne({
                idpago: parseInt(id, 10),
            });
        }
        // Verificar si el item fue encontrado
        if (!PagosItem) {
            throw boom.notFound(`No se encontró ningún elemento con idpago: ${id}`);
        }
        return (PagosItem);
    } catch (error) {
        // Capturar errores específicos de MongoDB y devolver un mensaje adecuado
        if (error.name === 'CastError') {
            throw boom.badRequest('ID inválido');
        }
        throw boom.internal(error);
    }
};

export const postPagosItem = async (item) => {
    try {
        const newPagosItem = new Pagos(item);
        return await newPagosItem.save();
    } catch (error) {
        throw error;
    }
};

export const insertManyPagosItems = async (items) => {
    try {
        // Validamos que se reciban varios items
        if (!Array.isArray(items) || items.length === 0) {
            throw boom.badRequest('Debe proporcionar una lista de pagos válida');
        }

        // Usamos insertMany para agregar varios documentos
        const insertedItems = await Pagos.insertMany(items);

        return {
            success: true,
            data: insertedItems,
        };
    } catch (error) {
        // Manejo de errores
        throw boom.internal(error);
    }
};

export const patchPagoMontoObservacion = async (id, updatedFields) => {
    try {
        // Realizamos la actualización buscando por IdPagoOK y actualizando 'MontoTotal' y 'Observacion'
        const updatedPago = await Pagos.findOneAndUpdate(
            { IdPagoOK: id }, // Filtro para encontrar el pago por su IdPagoOK
            {
                $set: {
                    MontoTotal: updatedFields.MontoTotal,     // Actualizamos el campo 'MontoTotal'
                    Observacion: updatedFields.Observacion    // Actualizamos el campo 'Observacion'
                }
            },
            { new: true, runValidators: true } // Retorna el nuevo documento actualizado y valida
        );

        // Verificamos si el pago fue encontrado y actualizado
        if (!updatedPago) {
            throw boom.notFound(`No se encontró ningún pago con el id: ${id}`);
        }

        // Retornamos el pago actualizado
        return updatedPago;
    } catch (error) {
        // Capturamos errores como el 'CastError' por IDs inválidos
        if (error.name === 'CastError') {
            throw boom.badRequest('ID inválido');
        }
        throw boom.internal(error);
    }
};




export const putPagosItem = async (id, newItem) => {
    try {
        return await Pagos.findOneAndUpdate({ IdPagoOK: id }, newItem, {
            new: true,
        });
    } catch (error) {
        throw boom.badImplementation(error);
    }
};

export const deletePagosItem = async (id) => {
    try {
        return await Pagos.findOneAndDelete({ IdPagoOK: id });
    }
    catch (error) {
        throw boom.badImplementation(error);
    }
}