import {Router} from "express";
import {
  crearUsuario,
  actualizarUsuario,
  listarUsuarios,
  eliminarUsuario,
  exportarUsuarios,
  obtenerUsuario
} from '../controllers/usuariosController';



const usuariosRouter = Router();

usuariosRouter.get('/',listarUsuarios);
usuariosRouter.post('/',crearUsuario);
usuariosRouter.put('/:id',actualizarUsuario);
usuariosRouter.delete('/:id',eliminarUsuario);
usuariosRouter.get('/exportar',exportarUsuarios);
usuariosRouter.get('/:id', obtenerUsuario);

export default usuariosRouter;
