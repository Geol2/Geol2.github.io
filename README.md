# Geol2.github.io

## 개발 환경

https://rubyinstaller.org/downloads/

```
gem install bundle

gem install jekyll bundler

# Windows error : C:\Ruby33-x64\msys64\tmp not found
> mkdir tmp
> tmp > 속성 > 보안 > 읽기/쓰기 권한 확인

# error : C:\Users\[name]\AppData\Local\Microsoft\WindowsApp 환경변수 설정 제거
bundle install

bundle exec jekyll serve
```

## 배포

main 브랜치 커밋/푸쉬