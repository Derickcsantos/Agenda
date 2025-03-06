const { supabase } = require('../supabaseClient'); // Usando o cliente Supabase de forma centralizada

// Funções para manipulação de categorias no banco de dados
class CategoriasModel {
  static async adicionarCategoria(nome) {
    const { data, error } = await supabase.from('categorias').insert([{ nome }]);
    return { data, error };
  }

  static async editarCategoria(id, nome) {
    const { data, error } = await supabase.from('categorias').update({ nome }).match({ id });
    return { data, error };
  }

  static async excluirCategoria(id) {
    const { error } = await supabase.from('categorias').delete().match({ id });
    return { error };
  }

  static async getCategorias() {
    const { data, error } = await supabase.from('categorias').select('*');
    return { data, error };
  }
}

module.exports = CategoriasModel;
