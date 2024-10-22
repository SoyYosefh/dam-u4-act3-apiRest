// Importamos los servicios relacionados con Pagos y boom para manejo de errores HTTP
import * as PagosServices from '../services/pagos.service';
import boom from '@hapi/boom';

// Controlador para obtener la lista completa de productos/servicios (pagos)
export const getPagosList = async (req, res, next) => {
    try {
        // Llama al servicio que obtiene la lista de productos/servicios
        const PagosList = await PagosServices.getPagosList();

        // Validación si no se encuentran productos/servicios
        if (!PagosList) {
            // Lanza un error 404 si no hay registros
            throw boom.notFound('No se encontraron pagos registrados.');
        } else if (PagosList) {
            // Si se encuentran registros, responde con código 200 y la lista en formato JSON
            res.status(200).json(PagosList);
        }

    } catch (error) {
        // Si ocurre un error, lo pasa al middleware de manejo de errores
        next(error);
    }
};

// Controlador para obtener un único producto/servicio por su ID
export const getPagosItem = async (req, res, next) => {
    try {
        // Extrae el id de los parámetros de la ruta (req.params)
        const { id } = req.params;

        // Extrae el tipo de clave de la consulta (si es necesario), con un valor por defecto
        const keyType = req.query.keyType || 'NK'; // 'OK' es el valor predeterminado si no se pasa 'keyType'

        // Llama al servicio para obtener el producto/servicio por su ID y tipo de clave
        const PagosItem = await PagosServices.getPagosItem(id, keyType);

        // Validación si no se encuentra el producto/servicio con ese ID
        if (!PagosItem) {
            // Lanza un error 404 si no se encuentra el registro
            throw boom.notFound('No se encontraron productos/servicios registrados.');
        } else if (PagosItem) {
            // Si se encuentra el registro, responde con código 200 y el producto/servicio en formato JSON
            res.status(200).json(PagosItem);
        }

    } catch (error) {
        // Si ocurre un error, lo pasa al middleware de manejo de errores
        next(error);
    }
};

// Controlador para manejar la creación de un nuevo Producto o Servicio
export const postPagosItem = async (req, res, next) => {
    try {
        // Se obtiene el objeto del cuerpo de la solicitud (paPagosItem) que contiene los datos del Producto/Servicio a crear
        const paPagosItem = req.body;

        // Se invoca el servicio que realiza la creación del Producto/Servicio con los datos recibidos
        const newPagosItem = await PagosServices.postPagosItem(paPagosItem);

        // Si no se pudo crear el Producto/Servicio, se lanza un error HTTP 400 (Bad Request) con un mensaje específico
        if (!newPagosItem) {
            throw boom.badRequest('No se pudo crear el Producto y/o Servicio.');
        }
        // Si se creó exitosamente, se responde con un código 201 (Created) y el objeto creado en formato JSON
        else if (newPagosItem) {
            res.status(201).json(newPagosItem);
        }
    } catch (error) {
        // En caso de un error en el proceso, se muestra el error en la consola y se pasa el error al siguiente middleware
        console.log(error);
        next(error);
    }
};

// Controlador para manejar la inserción de varios pagos
export const insertManyPagosItems = async (req, res, next) => {
    try {
        // Se obtiene el array de pagos del cuerpo de la solicitud
        const pagosItems = req.body;

        // Validamos que la lista de pagos no esté vacía
        if (!Array.isArray(pagosItems) || pagosItems.length === 0) {
            throw boom.badRequest('Debe proporcionar una lista válida de pagos.');
        }

        // Llama al servicio que realiza la inserción de varios pagos
        const insertedItems = await PagosServices.insertManyPagosItems(pagosItems);

        // Responde con un código 201 (Created) y los elementos insertados
        res.status(201).json(insertedItems);
    } catch (error) {
        // En caso de error, se pasa al middleware de manejo de errores
        next(error);
    }
};


// Controlador para realizar un patch en los campos MontoTotal y Observacion
export const patchPagosItem = async (req, res, next) => {
    try {
        // Extraemos el ID del pago de los parámetros
        const { id } = req.params;

        // Extraemos el cuerpo de la solicitud para obtener los campos a actualizar
        const { MontoTotal, Observacion } = req.body;

        // Validación de que al menos uno de los campos fue proporcionado
        if (MontoTotal === undefined && Observacion === undefined) {
            throw boom.badRequest('Debe proporcionar al menos un campo para actualizar.');
        }

        // Creamos un objeto con los campos que se van a actualizar dinámicamente
        const updateFields = {};
        if (MontoTotal !== undefined) updateFields.MontoTotal = MontoTotal;
        if (Observacion !== undefined) updateFields.Observacion = Observacion;

        // Llamamos al servicio que actualiza los campos específicos
        const updatedPagoItem = await PagosServices.patchPagoMontoObservacion(id, updateFields);

        // Si no se encuentra el item o no se actualiza, lanzamos un error
        if (!updatedPagoItem) {
            throw boom.notFound('No se encontró el pago o no se pudo actualizar.');
        }

        // Si todo está bien, enviamos el objeto actualizado
        res.status(200).json(updatedPagoItem);
    } catch (error) {
        next(error);
    }
};

// Controlador para manejar la actualización de un Producto o Servicio existente
export const putPagosItem = async (req, res, next) => {
    try {
        // Se extrae el ID del producto/servicio de los parámetros de la solicitud (req.params)
        const { id } = req.params;
        // Se obtiene el objeto del cuerpo de la solicitud (pagoItem) que contiene los datos a actualizar
        const pagoItem = req.body;
        // Se invoca el servicio para actualizar el Producto/Servicio con el ID y los datos recibidos
        const updatedPagoItem = await PagosServices.putPagosItem(id, pagoItem);
        // Si la actualización no fue exitosa, se lanza un error HTTP 400 (Bad Request) con un mensaje específico
        if (!updatedPagoItem) {
            throw boom.badRequest('No se pudo actualizar el Producto y/o Servicio.');
        }
        // Si la actualización fue exitosa, se responde con un código 200 (OK) y el objeto actualizado en formato JSON
        else if (updatedPagoItem) {
            res.status(200).json(updatedPagoItem);
        }
    } catch (error) {
        // En caso de un error, se pasa el error al siguiente middleware para que lo maneje
        next(error);
    }
};


// Controlador para manejar la eliminación de un Producto o Servicio
export const deletePagosItem = async (req, res, next) => {
    try {
        // Se extrae el ID del producto/servicio a eliminar de los parámetros de la solicitud (req.params)
        const { id } = req.params;
        // Se invoca el servicio para eliminar el Producto/Servicio con el ID proporcionado
        const deletedPagoItem = await PagosServices.deletePagosItem(id);
        // Si la eliminación no fue exitosa, se lanza un error HTTP 400 (Bad Request) con un mensaje específico
        if (!deletedPagoItem) {
            throw boom.badRequest('No se pudo eliminar el Producto y/o Servicio.');
        }
        // Si la eliminación fue exitosa, se responde con un código 200 (OK) y el objeto eliminado en formato JSON
        else if (deletedPagoItem) {
            res.status(200).json(deletedPagoItem);
        }
    } catch (error) {
        // En caso de un error, se pasa el error al siguiente middleware para que lo maneje
        next(error);
    }
};
