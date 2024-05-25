import { RequestHandler } from "express";
import { Usuario } from "../models/usuario";
import bcrypt from 'bcrypt';
import excelJS from 'exceljs';

export const crearUsuario:RequestHandler = async (req,res)=>{
    const usuario = await Usuario.findOne({where:{correo:req.body.correo}});

    if(usuario){
        return res.status(400).json({message:"El correo ya está en uso"});
    }

    await Usuario.create({
        correo: req.body.correo,
        nombre: req.body.nombre,
        password: await bcrypt.hash(req.body.password,10)
    }).then((usuario)=>{
        return res.status(200).json(usuario);
    }).catch((error)=>{
        return res.status(500).json({message:"Error al crear el usuario",error:error});
    });

};


export const actualizarUsuario:RequestHandler = async (req,res)=>{
    const {id} = req.params;
    const usuario  = await Usuario.findByPk(id);
    if(!usuario){
        return res.status(404).json({message:"Usuario no encontrado"});
    }
    await Usuario.update({
        nombre: req.body.nombre,
        correo: req.body.correo,
        password: await bcrypt.hash(req.body.password,10) 
    },{where:{idUsuarios:id}}).then(()=>{
        return res.status(200).json({message:"Usuario actualizado"});
    }).catch((error)=>{
        return res.status(500).json({message:"Error al actualizar el usuario",error:error.message});
    });

};

export const obtenerUsuario:RequestHandler = async (req,res)=>{
    const {id} = req.params;
    const usuario = await Usuario.findByPk(id);
    if(!usuario){
        return res.status(404).json({message:"Usuario no encontrada"});
    }

    return res.status(200).json({
        idUsuarios: usuario.idUsuarios,
        correo: usuario.correo,
        nombre: usuario.nombre
    });
}

export const listarUsuarios:RequestHandler = async (req,res)=>{
    await Usuario.findAll({attributes:{exclude:["password"]}}).then((usuarios)=>{
        return res.status(200).json(usuarios);
    }).catch((error)=>{
        return res.status(500).json({message:"Error al obtener los usuarios",error:error.message});
    });
}

export const eliminarUsuario:RequestHandler = async (req,res)=>{
    const id = req.params.id;
    
    const usuario = await Usuario.findByPk(id);
    if(!usuario){
        return res.status(404).json({message:"El usuario no existe"});
    }


    await Usuario.destroy({where:{idUsuarios:id}}).then(()=>{
        return res.status(200).json({message:"Usuario eliminado"});
    }).catch((error)=>{
        return res.status(500).json({message:"Error al eliminar el usuario",error:error.message});
    });
}

export const exportarUsuarios:RequestHandler = async (req,res)=>{
    const usuarios = await Usuario.findAll({attributes:{exclude:["password"]}});
    const workbook = new excelJS.Workbook();
    const workSheet = workbook.addWorksheet("Usuarios");

    workSheet.columns = [
        {header:"ID",key:"idUsuarios"},
        {header:"Nombre",key:"nombre"},
        {header:"Correo electrónico",key:"correo"}
    ];

    usuarios.forEach(usuario => {
        workSheet.addRow(usuario.toJSON());
    });

    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition','attachment; filename=usuarios.xlsx');
    return workbook.xlsx.write(res).then(()=>{
        res.status(200).end();
    });
};
