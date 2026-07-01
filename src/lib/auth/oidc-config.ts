import { UserManager, WebStorageStateStore } from "oidc-client-ts";

let _userManager: UserManager | null = null;

const AUTHORITY = "https://login-rlspreview.congacloud.com/api/v1/auth";
const CLIENT_ID = "e77fc3cf-b8d0-4c60-a5e0-e0cbf614247f";
const PREFIX = "oidc.state.";

/** Reads the stored access token synchronously from localStorage. */
export function getAccessToken(): string {
  if (typeof window === "undefined") return "";
  try {
    const key = `${PREFIX}user:${AUTHORITY}:${CLIENT_ID}`;
    const stored = JSON.parse(window.localStorage.getItem(key) ?? "null");
    return stored?.access_token ?? "";
  } catch {
    return "";
  }
}

export function getUserManager(): UserManager {
  if (typeof window === "undefined") {
    throw new Error("getUserManager() must only be called in the browser.");
  }

  if (!_userManager) {
    const metadataUrl = process.env.NEXT_PUBLIC_OIDC_METADATA_URL || undefined;

    _userManager = new UserManager({
      authority: AUTHORITY,
      ...(metadataUrl ? { metadataUrl } : {}),
      client_id: CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/callback`,
      post_logout_redirect_uri: `${window.location.origin}/login`,
      silent_redirect_uri: `${window.location.origin}/auth/silent-renew`,
      response_type: "code",
      scope: "openid profile email",
      userStore: new WebStorageStateStore({
        store: window.localStorage,
        prefix: PREFIX,
      }),
      automaticSilentRenew: true,
      loadUserInfo: true,
    });
  }

  return _userManager;
}
