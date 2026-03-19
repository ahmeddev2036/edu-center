const ERRORS: Record<string, string> = {
  Unauthorized: 'غير مصرح لك بالدخول',
  'Not Found': 'العنصر غير موجود',
  Conflict: 'هذا العنصر موجود بالفعل',
  'Bad Request': 'البيانات المدخلة غير صحيحة',
  'Internal Server Error': 'خطأ في الخادم، حاول مرة أخرى',
  'Request failed': 'فشل الطلب، تحقق من الاتصال',
  Forbidden: 'ليس لديك صلاحية للقيام بهذا الإجراء',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return ERRORS[error.message] ?? error.message;
  }
  if (typeof error === 'string') return ERRORS[error] ?? error;
  return 'حدث خطأ غير متوقع';
}
