import { redirect } from "next/navigation";

// Публичная регистрация отключена — кабинет открыт только для команды ТОО.
// Новых пользователей создаёт администратор в /dashboard/settings/team.
export default function SignupDisabled() {
  redirect("/login");
}
