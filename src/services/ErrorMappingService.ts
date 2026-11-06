import { QueryFailedError } from "typeorm";
import { InvalidPageError } from "./InvalidPageError";

interface ErrorResponse {
    status: number;
    message: string;
}

export class ErrorMappingService {
    static mapErrorToResponse(error: unknown, resource: string): ErrorResponse {
        if (error instanceof InvalidPageError) {
            return { status: 400, message: error.message };
        }

        if (error instanceof QueryFailedError) {
            const code = (error.driverError as { code?: string }).code;

            if (code === "ER_DUP_ENTRY") {
                return { status: 409, message: `Já existe um registro de ${resource} com esses dados.` };
            }
            if (code === "ER_NO_DEFAULT_FOR_FIELD" || code === "ER_BAD_NULL_ERROR") {
                return { status: 400, message: `Campo obrigatório não fornecido para ${resource}.` };
            }
            if (code === "ER_NO_REFERENCED_ROW_2") {
                return { status: 400, message: `Registro relacionado informado para ${resource} não existe.` };
            }
            if (code === "ER_ROW_IS_REFERENCED_2") {
                return { status: 409, message: `Não é possível excluir ${resource}: existem registros vinculados.` };
            }
        }

        return { status: 500, message: "Erro interno do servidor." };
    }
}