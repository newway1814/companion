import { clearWorkspaceAction, deleteAccountAction } from "./actions";
import { PrivacySettings } from "./privacy-settings";

export default function SettingsPage() {
  return (
    <PrivacySettings
      clearAction={clearWorkspaceAction}
      deleteAction={deleteAccountAction}
    />
  );
}
