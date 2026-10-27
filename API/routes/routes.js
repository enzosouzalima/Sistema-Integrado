const express = require('express');
const router = express.Router();
module.exports = router;
const mongoose = require('mongoose');
const modeloTarefa = require('../models/tarefa');

// Armazenamento local de fallback para quando o MongoDB não estiver conectado
let localTarefas = [
    { _id: "1", descricao: "Estudar Frameworks WEB", statusRealizada: false },
    { _id: "2", descricao: "Comer Pizza", statusRealizada: false },
    { _id: "3", descricao: "Ajudar meus pais", statusRealizada: false }
];

// ROTA POST: Grava uma nova tarefa
router.post('/post', async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        const objetoTarefa = new modeloTarefa({
            descricao: req.body.descricao,
            statusRealizada: req.body.statusRealizada
        });
        try {
            const tarefaSalva = await objetoTarefa.save();
            return res.status(200).json(tarefaSalva);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    const nova = {
        _id: String(Date.now()),
        descricao: req.body.descricao,
        statusRealizada: Boolean(req.body.statusRealizada)
    };
    localTarefas.unshift(nova);
    return res.status(200).json(nova);
});

// ROTA GET: Obter todas as tarefas (getAll)
router.get('/getAll', async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const resultados = await modeloTarefa.find();
            return res.json(resultados);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.json(localTarefas);
});

// ROTA DELETE: Elimina a tarefa identificada pelo id
router.delete('/delete/:id', async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
            return res.json(resultado);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    const item = localTarefas.find(t => t._id === req.params.id);
    localTarefas = localTarefas.filter(t => t._id !== req.params.id);
    return res.json(item || { _id: req.params.id });
});

// ROTA PATCH: Atualiza a tarefa identificada pelo id
router.patch('/update/:id', async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const id = req.params.id;
            const novaTarefa = req.body;
            const options = { new: true };
            const result = await modeloTarefa.findByIdAndUpdate(
                id, novaTarefa, options
            );
            return res.json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    const item = localTarefas.find(t => t._id === req.params.id);
    if (item) {
        if (req.body.descricao !== undefined) item.descricao = req.body.descricao;
        if (req.body.statusRealizada !== undefined) item.statusRealizada = req.body.statusRealizada;
    }
    return res.json(item || req.body);
});
