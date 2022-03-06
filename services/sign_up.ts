import { District, Suburb } from './user';

export type SignUpValues = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'diverse' | '';
  birthday: string;
  phoneNumberPrefix: string;
  phoneNumber: string;
  district: District;
  suburb: Suburb;
};
export type SignUpErrorValues = {
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthday?: string;
  phoneNumberPrefix?: string;
  phoneNumber?: string;
  district?: string;
  suburb?: string;
};

const urlBase = 'http://localhost:8080';

export default class SignUpService {
  static async usernameFilter(username: string) {
    if (!username) {
      return 'Please fill up username';
    } else if (username.length < 6 || username.length > 20) {
      return 'Choose a username 6 - 20 characters long.';
    } else {
      if (!(await SignUpService.checkValidUsername(username))) {
        return `The username, ${username}, is already exist.`;
      }
    }
  }

  static passwordFilter(password: string) {
    if (!password) {
      return 'Please fill up password';
    } else if (!/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,20}$/.test(password)) {
      return 'Password is not valid.';
    }
  }

  static confirmPasswordFilterConstructor(password: string) {
    return (confirmPassword: string) => {
      if (!confirmPassword) {
        return 'Please fill up confirm password';
      } else if (password !== confirmPassword) {
        return 'Password does not match.';
      }
    };
  }

  static async emailFilter(email: string) {
    if (!email) {
      return 'Please fill up email address.';
    } else if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
      return 'The email address is not valid.';
    } else {
      if (!(await SignUpService.checkValidEmail(email))) {
        return `This email address is already taken.`;
      }
    }
  }

  static async validateSignUp(values: SignUpValues) {
    const errors: SignUpErrorValues = {};

    const keys = Object.keys(values) as Array<keyof typeof values>;
    keys.forEach((i) => {
      if (!values[i]) {
        errors[i] = `Please fill up the ${i}`;
      }
    });

    const usernameError = await SignUpService.usernameFilter(values.username);
    if (usernameError) {
      errors.username = usernameError;
    }
    const passwordError = SignUpService.passwordFilter(values.password);
    if (passwordError) {
      errors.username = usernameError;
    }
    const confirmPasswordError = SignUpService.confirmPasswordFilterConstructor(values.password)(
      values.password[1]
    );
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError;
    }
    const emailError = await SignUpService.emailFilter(values.email);
    if (emailError) {
      errors.email = emailError;
    }

    return errors;
  }

  private static async checkValidUsername(username: string): Promise<boolean> {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const response: { isValid: boolean } = await (
      await fetch(`${urlBase}/auth/check_username/${username}`, requestOptions)
    ).json();

    return response.isValid;
  }

  private static async checkValidEmail(email: string): Promise<boolean> {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const response: { isValid: boolean } = await (
      await fetch(`${urlBase}/auth/check_email/${email}`, requestOptions)
    ).json();

    return response.isValid;
  }
}