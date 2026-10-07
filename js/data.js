/* =======================================================
   CONNECT 공지사항 데이터 (중앙 집중 관리)
   - index.html 메인 공지사항 미리보기
   - notice.html 목록 및 상세
   두 곳에서 동일한 데이터를 공유합니다.
======================================================= */

const noticeData = [
    {
        title: '개인정보처리방침',
        date: '2026. 06. 19',
        content: `
            <p>주식회사 커넥트(이하 '회사')는 이용자의 개인정보를 중요시하며, "개인정보 보호법" 등 관련 법령을 준수하고 있습니다.</p>
            <p>회사는 본 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.</p>
            <h4>1. 수집하는 개인정보 항목</h4>
            <p>- 필수항목 : 성명, 이메일 주소, 비밀번호, 서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보<br>
            - 선택항목 : 연락처(휴대전화 번호)</p>
            <h4>2. 개인정보의 수집 및 이용목적</h4>
            <p>- 서비스 제공 및 운영 : 콘텐츠 제공, 맞춤형 서비스 제공, 본인인증<br>
            - 회원 관리 : 회원제 서비스 이용에 따른 본인확인, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 분쟁 조정을 위한 기록보존, 민원처리 및 고지사항 전달</p>
            <h4>3. 개인정보의 보유 및 이용기간</h4>
            <p>회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 일정 기간 동안 개인정보를 안전하게 보관합니다.</p>
        `
    },
    {
        title: 'Privacy Policy',
        date: '2026. 06. 19',
        content: `
            <p>CONNECT Co., Ltd. (hereinafter referred to as the 'Company') highly values your privacy and complies with the "Personal Information Protection Act" and other related laws.</p>
            <p>Through this Privacy Policy, the Company informs you of the purposes and methods for which the personal information provided by the users is used, and the measures taken to protect it.</p>
            <h4>1. Items of Personal Information Collected</h4>
            <p>- Required items: Name, email address, password, service usage records, access logs, cookies, access IP information.<br>
            - Optional items: Contact number (mobile phone).</p>
            <h4>2. Purpose of Collection and Use of Personal Information</h4>
            <p>- Service provision and operation: Provision of content, customized services, and identity verification.<br>
            - Member management: Identity verification for membership services, prevention of unauthorized use, confirmation of intent to join, record retention for dispute resolution, and handling complaints.</p>
            <h4>3. Period of Retention and Use of Personal Information</h4>
            <p>As a general rule, the Company promptly destroys personal information once the purpose of collection and use is achieved. However, if retention is required by relevant laws and regulations, the information is kept securely for a specified period.</p>
        `
    },
    {
        title: '게임서비스이용약관',
        date: '2026. 06. 19',
        content: `
            <h4>제1조 (목적)</h4>
            <p>본 약관은 주식회사 커넥트(이하 "회사"라 합니다)가 제공하는 게임 및 제반 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
            <h4>제2조 (용어의 정의)</h4>
            <p>1. "회원"이란 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 자를 의미합니다.<br>
            2. "서비스"란 회사가 제공하는 게임 및 이와 관련된 모든 부가 서비스를 의미합니다.</p>
            <h4>제3조 (약관의 효력 및 변경)</h4>
            <p>1. 회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면이나 연결 화면을 통해 게시합니다.<br>
            2. 회사는 관련 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있으며, 개정 시에는 적용일자와 개정 사유를 명시하여 최소 7일 전에 공지합니다.</p>
            <h4>제4조 (회원의 의무)</h4>
            <p>1. 회원은 서비스 이용 시 다음 각 호의 행위를 하여서는 안 됩니다.<br>
            - 타인의 정보 도용<br>
            - 회사가 게시한 정보의 임의 변경<br>
            - 회사의 운영진, 직원 또는 관계자를 사칭하는 행위<br>
            - 기타 불법적이거나 부당한 행위</p>
            <h4>제5조 (서비스의 중단)</h4>
            <p>회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 합리적인 이유가 있는 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
        `
    },
    {
        title: 'Terms of Game Service',
        date: '2026. 06. 19',
        content: `
            <h4>Article 1 (Purpose)</h4>
            <p>The purpose of these Terms of Use is to stipulate the rights, duties, responsibilities, and other necessary matters between CONNECT Co., Ltd. (hereinafter referred to as the "Company") and the Members regarding the use of games and related services provided by the Company.</p>
            <h4>Article 2 (Definitions)</h4>
            <p>1. "Member" means a person who agrees to these Terms and uses the services provided by the Company.<br>
            2. "Service" means the games and all related additional services provided by the Company.</p>
            <h4>Article 3 (Effect and Amendment of the Terms)</h4>
            <p>1. The Company posts the contents of these Terms on the initial screen of the Service or through a connection screen so that Members can easily understand them.<br>
            2. The Company may amend these Terms within the scope that does not violate relevant laws. In case of amendment, the effective date and reasons for the amendment will be notified at least 7 days in advance.</p>
            <h4>Article 4 (Obligations of the Member)</h4>
            <p>1. Members shall not engage in the following acts when using the Service:<br>
            - Stealing another person's information<br>
            - Arbitrarily modifying information posted by the Company<br>
            - Impersonating the Company's management, employees, or related persons<br>
            - Any other illegal or unfair acts</p>
            <h4>Article 5 (Suspension of Service)</h4>
            <p>The Company may temporarily suspend the provision of the Service in cases of maintenance, replacement, breakdown of information and communication equipment, interruption of communication, or any reasonable operational reasons.</p>
        `
    }
];
