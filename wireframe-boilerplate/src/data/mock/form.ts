// 폼 패턴용 목업 데이터

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'time' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: string;
}

export interface FormConfig {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export const mockFormFields: Record<string, FormConfig> = {
  memberRegistration: {
    id: 'form-member',
    title: '회원 등록',
    description: '새로운 회원 정보를 입력해주세요.',
    fields: [
      {
        name: 'name',
        label: '이름',
        type: 'text',
        placeholder: '홍길동',
        required: true,
      },
      {
        name: 'email',
        label: '이메일',
        type: 'email',
        placeholder: 'example@email.com',
        required: true,
      },
      {
        name: 'phone',
        label: '연락처',
        type: 'text',
        placeholder: '010-0000-0000',
        required: true,
      },
      {
        name: 'birthDate',
        label: '생년월일',
        type: 'date',
        required: false,
      },
      {
        name: 'role',
        label: '회원 등급',
        type: 'select',
        required: true,
        options: [
          { label: '일반회원', value: 'member' },
          { label: '매니저', value: 'manager' },
          { label: '관리자', value: 'admin' },
        ],
        defaultValue: 'member',
      },
      {
        name: 'note',
        label: '비고',
        type: 'textarea',
        placeholder: '추가 메모를 입력하세요.',
        required: false,
      },
    ],
  },
  productRegistration: {
    id: 'form-product',
    title: '상품 등록',
    description: '새로운 상품 정보를 등록합니다.',
    fields: [
      {
        name: 'productName',
        label: '상품명',
        type: 'text',
        placeholder: '상품 이름을 입력하세요',
        required: true,
      },
      {
        name: 'category',
        label: '카테고리',
        type: 'select',
        required: true,
        options: [
          { label: '멤버십', value: 'membership' },
          { label: '교육', value: 'education' },
          { label: '장비', value: 'equipment' },
          { label: '이벤트', value: 'event' },
        ],
      },
      {
        name: 'price',
        label: '가격 (원)',
        type: 'number',
        placeholder: '0',
        required: true,
      },
      {
        name: 'stock',
        label: '재고 수량',
        type: 'number',
        placeholder: '0',
        required: true,
      },
      {
        name: 'description',
        label: '상품 설명',
        type: 'textarea',
        placeholder: '상품에 대한 상세 설명을 입력하세요.',
        required: false,
      },
    ],
  },
  reservationForm: {
    id: 'form-reservation',
    title: '예약 등록',
    description: '시설 또는 프로그램 예약을 등록합니다.',
    fields: [
      {
        name: 'reserverName',
        label: '예약자명',
        type: 'text',
        placeholder: '이름을 입력하세요',
        required: true,
      },
      {
        name: 'email',
        label: '이메일',
        type: 'email',
        placeholder: 'example@email.com',
        required: true,
      },
      {
        name: 'reservationDate',
        label: '예약 날짜',
        type: 'date',
        required: true,
      },
      {
        name: 'reservationTime',
        label: '예약 시간',
        type: 'time',
        required: true,
      },
      {
        name: 'numberOfPeople',
        label: '인원수',
        type: 'number',
        placeholder: '1',
        required: true,
      },
      {
        name: 'facility',
        label: '시설 선택',
        type: 'select',
        required: true,
        options: [
          { label: '대회의실 (30인)', value: 'meeting-large' },
          { label: '소회의실 (10인)', value: 'meeting-small' },
          { label: '교육장 A', value: 'training-a' },
          { label: '교육장 B', value: 'training-b' },
          { label: '다목적홀', value: 'multipurpose' },
        ],
      },
      {
        name: 'request',
        label: '요청 사항',
        type: 'textarea',
        placeholder: '특별한 요청 사항이 있으시면 입력해주세요.',
        required: false,
      },
    ],
  },
};
