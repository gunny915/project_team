# 유명인 이름 맞추기 게임

유명인의 얼굴을 보고 이름을 맞추는 게임이다.\
미적인 요소는 전면 배제한 컴팩트한 게임이라고 볼 수 있다.\
쉬운 게임이지만 얼굴은 아는데 이름이 긴가민가한 사람을 맞추는게 고득점의 비결이다.

## 게임 설명

* 게임은 현재 총 15문제를 풀어야 한다.
* 구글 로그인이 가능하지만 로그인 없이도 게임 진행이 가능하다. 다만 기록을 남기기 위해서는 구글 로그인이 필요하다.
* 주어진 유명인사의 이미지를 보고 이름을 입력하면 된다.
* 유명인이 활동명과 본명이 별개인 경우 활동명을 따른다. (ex. 레드벨벳 슬기는 본명이 강슬기이지만 정답은 슬기이다.)
* 게임 진해에 따라 내가 맞춘 문제의 갯수가 우측 상단에 뜬다.

## 과제 특징

### Open Api 사용하여 구글 로그인 구현
* App.js 내의 loginHandler를 통해 구글 로그인을 구현하였다.

### Firestore Database, Storage
* Firebase가 제공하는 DB인 Firestore Database와 Storage에 정보를 저장함
    * 유저의 플레이 기록은 'user'와 'score'가 key인 오브젝트로 Firestore에 저장
    * 문제의 정답은 'index'와 'answer'가 key인 오브젝트로 Firestore에 저장
    * 문제에 필요한 이미지는 Storage에 저장하였으며 파일명은 정답의 index + 1과 동일
  
### 문제 랜덤 생성
* 유저가 푸는 문제는 총 15개이지만 DB에는 이보다 많은 문제들이 준비되어있다. 준비된 문제의 총 갯수로부터 랜덤한 
n개의 숫자를 임의로 배열하여 이를 통해 문제를 출제한다.
  
* 이번 과제에는 반영하지 못했지만 게임 시작 시 문제 수를 정하는 것도 가능하다. 

