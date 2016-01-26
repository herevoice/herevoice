package net.ddns.herevoice.herevoice;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;
import com.firebase.client.AuthData;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;

import org.w3c.dom.UserDataHandler;

public class LoginActivity extends AppCompatActivity {
    // Firebase Object
    Firebase ref;

    // Widgets
    LoginButton loginFbBtn;

    CallbackManager callbackManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        facebookInit();
        setContentView(R.layout.activity_login);
        Log.d("LOGIN", "START ACTIVITY");
        Firebase.setAndroidContext(this);
        ref = new Firebase("https://herevoice.firebaseio.com");
        Log.d("LOGIN", "FIREBASE SUCCESS");
        initBtn();

    }

    private void initBtn() {
        // Attach widget
        loginFbBtn = (LoginButton) findViewById(R.id.login_fb);

        // Attach Listener
        loginFbBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

            }
        });
    }

    private void facebookInit() {
        FacebookSdk.sdkInitialize(this.getApplicationContext());

        callbackManager = CallbackManager.Factory.create();

        LoginManager.getInstance().registerCallback(callbackManager,
                new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(LoginResult loginResult) {
                        // App code
                        Log.d("LOGIN", "FB: LOGIN SUCCESS");
                        onFacebookAccessTokenChange(loginResult.getAccessToken());
                    }

                    @Override
                    public void onCancel() {
                        // App code
                        Log.d("LOGIN", "FB: LOGIN CANCELED");
                    }

                    @Override
                    public void onError(FacebookException exception) {
                        // App code
                        Log.d("LOGIN", "FB: LOGIN FAILED");
                    }
                });
    }

    private void onFacebookAccessTokenChange(AccessToken token) {
        if (token != null) {
            ref.authWithOAuthToken("facebook", token.getToken(), new Firebase.AuthResultHandler() {
                @Override
                public void onAuthenticated(AuthData authData) {
                    // The Facebook user is now authenticated with your Firebase app
                    Log.d("LOGIN", "TOKEN: " + authData.getUid());
                    Firebase usersChild = ref.child("users");

                    usersChild.setValue(authData.getUid());
                }

                @Override
                public void onAuthenticationError(FirebaseError firebaseError) {
                    // there was an error
                    Log.d("LOGIN", "FAILED");
                }
            });
        } else {
        /* Logged out of Facebook so do a logout from the Firebase app */
            ref.unauth();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        callbackManager.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onResume() {
        super.onResume();

        // Logs 'install' and 'app activate' App Events.
        AppEventsLogger.activateApp(this);
    }

    @Override
    protected void onPause() {
        super.onPause();

        // Logs 'app deactivate' App Event.
        AppEventsLogger.deactivateApp(this);
    }
}
