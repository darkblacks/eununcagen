import { auth } from "../firebase";
import { db } from "../supabase";
import { DEFAULT_ROOM_ID } from "../utils/constants";

export async function saveAnswer(
  questionIndex: number,
  roundId: number,
  answer: boolean
) {
  console.group("saveAnswer");

  try {
    const user = auth.currentUser;

    console.log("auth.currentUser:", user);
    console.log("questionIndex recebido:", questionIndex);
    console.log("roundId recebido:", roundId);
    console.log("answer recebido:", answer);
    console.log("DEFAULT_ROOM_ID:", DEFAULT_ROOM_ID);

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    if (questionIndex === undefined || questionIndex === null) {
      throw new Error("questionIndex está indefinido.");
    }

    if (roundId === undefined || roundId === null) {
      throw new Error("roundId está indefinido.");
    }

    const answerId = `${DEFAULT_ROOM_ID}_${questionIndex}_${user.uid}`;

    const payload = {
      id: answerId,
      room_id: DEFAULT_ROOM_ID,
      question_index: questionIndex,
      round_id: roundId,
      user_id: user.uid,
      user_name: user.email?.split("@")[0] ?? "Usuário",
      answer,
      created_at: Date.now(),
    };

    console.log("payload enviado para Supabase:", payload);

    const { data, error } = await db.from("answers").upsert(payload).select();

    console.log("retorno do upsert:", { data, error });

    if (error) {
      console.error("erro do Supabase no upsert:", error);
      throw error;
    }

    console.log("voto salvo com sucesso.");
    return data;
  } catch (err) {
    console.error("erro em saveAnswer:", err);
    throw err;
  } finally {
    console.groupEnd();
  }
}

export async function loadAnswersByQuestion(questionIndex: number) {
  console.group("loadAnswersByQuestion");

  try {
    console.log("questionIndex recebido:", questionIndex);

    const { data, error } = await db
      .from("answers")
      .select("*")
      .eq("room_id", DEFAULT_ROOM_ID)
      .eq("question_index", questionIndex);

    console.log("retorno da busca por questão:", { data, error });

    if (error) {
      console.error("erro ao carregar respostas por questão:", error);
      throw error;
    }

    return data ?? [];
  } catch (err) {
    console.error("erro em loadAnswersByQuestion:", err);
    throw err;
  } finally {
    console.groupEnd();
  }
}

export async function loadAllAnswers() {
  console.group("loadAllAnswers");

  try {
    const { data, error } = await db
      .from("answers")
      .select("*")
      .eq("room_id", DEFAULT_ROOM_ID);

    console.log("retorno da busca geral:", { data, error });

    if (error) {
      console.error("erro ao carregar todas as respostas:", error);
      throw error;
    }

    return data ?? [];
  } catch (err) {
    console.error("erro em loadAllAnswers:", err);
    throw err;
  } finally {
    console.groupEnd();
  }
}

export async function loadMyAnswerForQuestion(questionIndex: number) {
  console.group("loadMyAnswerForQuestion");

  try {
    const user = auth.currentUser;

    if (!user) {
      return null;
    }

    const { data, error } = await db
      .from("answers")
      .select("*")
      .eq("room_id", DEFAULT_ROOM_ID)
      .eq("question_index", questionIndex)
      .eq("user_id", user.uid)
      .maybeSingle();

    console.log("retorno da busca do meu voto:", { data, error });

    if (error) {
      console.error("erro ao carregar meu voto:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("erro em loadMyAnswerForQuestion:", err);
    throw err;
  } finally {
    console.groupEnd();
  }
}

export async function clearAllAnswers() {
  console.group("clearAllAnswers");

  try {
    const { data, error } = await db
      .from("answers")
      .delete()
      .eq("room_id", DEFAULT_ROOM_ID)
      .select();

    console.log("retorno do delete:", { data, error });

    if (error) {
      console.error("erro ao limpar respostas:", error);
      throw error;
    }

    return data ?? [];
  } catch (err) {
    console.error("erro em clearAllAnswers:", err);
    throw err;
  } finally {
    console.groupEnd();
  }
}