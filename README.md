# 뭐든

친구의 취향 정보를 바탕으로 선물을 추천하고 주문 내역을 확인하는 개인 웹 프로젝트입니다.

## 프로젝트 구성

- 프론트엔드: React, JavaScript, Vite, Axios
- 백엔드: Java 17, Spring Boot, MyBatis
- 데이터베이스: Oracle

```text
mwodeun/
├─ src/                    # React 화면과 스타일
├─ public/                 # 정적 파일
├─ mwo-deun-server/        # Spring Boot 서버 및 MyBatis SQL
├─ package.json
└─ README.md
```

## 주요 구현 내용

- 회원 가입·로그인 화면 및 관련 서버 API
- 친구 목록과 취향 정보 등록·수정
- 취향 키워드와 상품 정보를 비교하는 점수 기반 선물 추천
- 장바구니 조회·추가·수량 변경·삭제
- 재고 확인·차감과 선물 주문 정보 저장
- 송신자·수신자를 구분한 보낸 선물·받은 선물 조회
- 상품·회원·주문 관리 화면

## 실행 준비

Node.js와 npm, 프로젝트 의존성을 지원하는 JDK, Oracle DB가 필요합니다.
원본의 의존성 버전과 소스 코드를 유지했습니다. 실행 환경에 따라 Java·Spring Boot 및 패키지 버전의 호환성 확인이 필요합니다.

### 데이터베이스

서버 설정 파일은 `mwo-deun-server/src/main/resources/application.properties`입니다.

| 항목 | 기본값 |
| --- | --- |
| 접속 URL | `jdbc:oracle:thin:@localhost:1521:xe` |
| 계정 | `mwodeun` |
| 비밀번호 | `1234` |

비밀번호는 요청에 따라 `1234`로 고정했습니다. URL과 계정은 실제 Oracle 환경에 맞게 수정하거나 `DB_URL`, `DB_USERNAME` 환경변수로 지정할 수 있습니다. 새 저장소에는 원본 계정명과 원격 DB 주소를 포함하지 않았습니다.

원본 뭐든 서버 디렉터리에 DB 초기화 SQL이 없어 이 패키지에는 스키마·샘플 데이터가 포함되지 않습니다. 기존 DB를 사용하거나 `MEMBER`, `FRIEND`, `PREFERENCE`, `PRODUCT`, `CART`, `ORDERS` 테이블 및 키 생성 구성을 별도로 준비해야 합니다. 테이블별 요구 필드는 `src/main/resources/mapper/`의 SQL을 참고하세요.

### 백엔드

Windows PowerShell에서:

```powershell
cd mwo-deun-server
.\mvnw.cmd spring-boot:run
```

macOS/Linux에서는 `sh ./mvnw spring-boot:run`을 사용합니다. 기본 서버 주소는 `http://localhost:8080`입니다.

### 프론트엔드

저장소 루트에서 새 터미널을 열어 실행합니다.

```powershell
npm ci
npm run dev
```

화면 주소는 `http://localhost:5173`입니다. 프론트엔드 API 주소와 서버 CORS 설정도 해당 로컬 주소를 사용합니다.

## 현재 연동 상태

이 저장소는 기존 소스에서 뭐든 관련 파일을 분리한 버전이며 기능 재작성은 하지 않았습니다.

- `integrate-react`의 로그인 화면은 토큰을 포함한 응답을 기대하지만, 함께 보관된 서버의 로그인 API는 회원 객체를 반환합니다. 해당 서버에서는 JWT 발급·검증 코드가 확인되지 않습니다.
- 친구 추가 화면이 호출하는 `/api/members/search`는 함께 보관된 서버 코드에 없습니다. 친구 목록이 기대하는 이름·생일 필드와 서버 응답의 차이도 확인이 필요합니다.
- 관리자 메뉴의 화면 표시 조건과 서버에서의 접근 권한 검증은 구분하여 확인해야 합니다.
- 외부 결제 승인 연동, 주문·재고 변경의 트랜잭션 처리, DB를 연결한 전체 기능 테스트는 별도 확인 사항입니다.

기존에 실행하던 서버나 DB가 별도로 있다면 그 버전과 함께 확인해야 합니다.

## 원본

[taehoo03/javaProject](https://github.com/taehoo03/javaProject)의 `integrate-react` 브랜치에서 분리했습니다.
기준 커밋: `6b45da305c54cbc8aab59269f8df2070fa0a0393`.
Java 수업·실습 폴더, 기존 Git 이력, 빌드 결과물, 설치된 패키지는 제외했습니다.
