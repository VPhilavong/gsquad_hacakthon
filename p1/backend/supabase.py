import os
import test


def signUp(users_email, users_password):
    return test.supabase.auth.sign_up({ "email": users_email, "password": users_password })

def signIn(users_email, users_password):
    return test.supabase.auth.sign_in_with_password({ "email": users_email, "password": users_password })

