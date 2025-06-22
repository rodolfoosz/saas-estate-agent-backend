// src/common/constants/messages.ts

export const Messages = {
  // Usuário
  USER_ALREADY_EXISTS: 'Já existe um usuário com esse e-mail.',
  USER_NOT_FOUND: 'Usuário não encontrado.',
  USER_CREATED_SUCCESS: 'Usuário criado com sucesso.',
  USER_UPDATED_SUCCESS: 'Usuário atualizado com sucesso.',
  USER_DELETED_SUCCESS: 'Usuário removido com sucesso.',
  PASSWORDS_DO_NOT_MATCH: 'As senhas não coincidem.',

  // Autenticação
  INVALID_CREDENTIALS: 'Credenciais inválidas.',
  UNAUTHORIZED: 'Não autorizado.',
  TOKEN_EXPIRED: 'Sessão expirada. Faça login novamente.',
  TOKEN_INVALID: 'Token inválido.',

  // Erros genéricos
  INTERNAL_SERVER_ERROR: 'Erro interno no servidor.',
  FORBIDDEN: 'Acesso negado.',
  BAD_REQUEST: 'Requisição inválida.',
  CONFLICT: 'Conflito de dados.',
};
