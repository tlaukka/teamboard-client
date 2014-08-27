'use strict';


module.exports = function($translateProvider) {

	$translateProvider.translations('en', {
		'AUTH_REGISTER': 'Register',
		'AUTH_LOGIN': 'Login',
		'AUTH_EMPTYFIELDS': 'Please enter your email and password.',
		'AUTH_LABEL_EMAIL': 'Email',
		'AUTH_LABEL_PASSWORD': 'Password',
		'AUTH_LABEL_SIGNIN': 'Sign in',
		'AUTH_MESSAGE_NOTREGISTERED': 'Not registered?',
		'AUTH_MESSAGE_ALREADYREGISTERED': 'Already registered?',

		'TOPBAR_LABEL_BOARDS': 'Boards',
		'TOPBAR_LABEL_CREATEBOARD': 'Create board',

		'SIDEBAR_LABEL_BOARDS': 'Boards',
		'SIDEBAR_LABEL_LOGOUT': 'Log out',

		'MODAL_HEADER_NEWBOARD': 'Create a new board',
		'MODAL_LABEL_NAME': 'Name',
		'MODAL_LABEL_BOARDNAME': 'Board name',
		'MODAL_LABEL_VISIBILITY': 'Visibility',
		'MODAL_LABEL_PRIVATE': 'Private',
		'MODAL_LABEL_PUBLIC': 'Public',
		'MODAL_HEADER_PEOPLEVIEW': 'People on this board',
		'MODAL_LABEL_CANCEL': 'Cancel',
		'MODAL_LABEL_CREATE': 'Create',
		'MODAL_HEADER_BOARDEDIT': 'Edit board',
		'MODAL_LABEL_REMOVE': 'Remove',
		'MODAL_HEADER_PEOPLEADD': 'Invite people',
		'MODAL_LABEL_PEOPLEADD': 'Invite people',
		'MODAL_LABEL_INVITE': 'Invite',
		'MODAL_LABEL_SAVECHANGES': 'Save changes'
	});

	$translateProvider.translations('ru', {
		'AUTH_LABEL_REGISTER': 'Зарегистрироваться',
		'AUTH_LABEL_LOGIN': 'Войти',
		'AUTH_MESSAGE_EMPTYFIELDS': 'Пожалуйста, введите свой ​​логин и пароль.',
		'AUTH_LABEL_EMAIL': 'E-mail',
		'AUTH_LABEL_PASSWORD': 'Пароль',
		'AUTH_LABEL_SIGNIN': 'Войдите',
		'AUTH_MESSAGE_NOTREGISTERED': 'Вы не зарегистрированы?',
		'AUTH_MESSAGE_ALREADYREGISTERED': 'Уже зарегистрированы?',

		'TOPBAR_LABEL_BOARDS': 'Доски',
		'TOPBAR_LABEL_CREATEBOARD': 'Создание сообщения',

		'SIDEBAR_LABEL_BOARDS': 'Доски',
		'SIDEBAR_LABEL_LOGOUT': 'Выйти',

		'MODAL_HEADER_NEWBOARD': 'Создать новый совет',
		'MODAL_LABEL_NAME': 'Имя',
		'MODAL_LABEL_BOARDNAME': 'Имя доска',
		'MODAL_LABEL_VISIBILITY': 'Видимость',
		'MODAL_LABEL_PRIVATE': 'Личный',
		'MODAL_LABEL_PUBLIC': 'Общественный',
		'MODAL_HEADER_PEOPLEVIEW': 'Люди на этой плате',
		'MODAL_LABEL_CANCEL': 'Отменить',
		'MODAL_LABEL_CREATE': 'Создать',
		'MODAL_HEADER_BOARDEDIT': 'Редактировать доска',
		'MODAL_LABEL_REMOVE': 'Удалять',
		'MODAL_HEADER_PEOPLEADD': 'Пригласить людей',
		'MODAL_LABEL_PEOPLEADD': 'Пригласить людей',
		'MODAL_LABEL_INVITE': 'Приглашать',
		'MODAL_LABEL_SAVECHANGES': 'Сохранить изменения'
	});

	$translateProvider.preferredLanguage('ru');
}
