import { GoogleLogin } from '@react-oauth/google';

interface GoogleLoginButtonProps {
  onIdToken: (idToken: string) => void;
  onError?: () => void;
}

export const GoogleLoginButton = ({ onIdToken, onError }: GoogleLoginButtonProps) => {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const idToken = credentialResponse.credential;
        if (idToken) {
          onIdToken(idToken);
        } else {
          onError?.();
        }
      }}
      onError={() => onError?.()}
      size="large"
      shape="rectangular"
      theme="outline"
      text="signin_with"
      locale="ru"
      width="280"
    />
  );
};
