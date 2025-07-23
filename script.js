// DOM要素の取得
// JavaScriptからHTML要素にアクセスするために、各要素のIDを使って参照を取得します。
const imageURLInput = document.getElementById('imageURL'); // 画像URL入力欄
const nameInput = document.getElementById('name');         // 氏名入力欄
const introductionInput = document.getElementById('introduction'); // 自己紹介入力欄
const saveProfileBtn = document.getElementById('saveProfileBtn'); // 保存ボタン

const profileImagePreview = document.getElementById('profileImagePreview'); // プロフィール画像プレビュー
const profileNamePreview = document.getElementById('profileNamePreview');   // 氏名プレビュー
const profileIntroductionPreview = document.getElementById('profileIntroductionPreview'); // 自己紹介プレビュー

// プロフィールを読み込み、表示する関数
// アプリが読み込まれたとき、または保存ボタンが押されたときに実行されます。
function loadProfile() {
    // ローカルストレージから保存されたプロフィールデータを取得します。
    // キー 'myProfile' で保存されており、JSON文字列として取得されます。
    const savedProfileJSON = localStorage.getItem('myProfile');

    // データが存在するかどうかを確認します。
    if (savedProfileJSON) {
        // JSON文字列をJavaScriptのオブジェクトに変換します。
        const savedProfile = JSON.parse(savedProfileJSON);

        // 取得したデータを入力フィールドに設定します。
        imageURLInput.value = savedProfile.imageURL || ''; // データがない場合は空文字列
        nameInput.value = savedProfile.name || '';
        introductionInput.value = savedProfile.introduction || '';

        // 取得したデータをプレビューエリアに表示します。
        // データがない場合は初期値または空文字列を設定します。
        profileImagePreview.src = savedProfile.imageURL || 'https://via.placeholder.com/150';
        profileNamePreview.textContent = savedProfile.name || 'あなたの氏名';
        profileIntroductionPreview.textContent = savedProfile.introduction || 'ここに自己紹介文が表示されます。';
    } else {
        // 保存されたデータがない場合、プレビューを初期状態に戻します。
        profileImagePreview.src = 'https://via.placeholder.com/150';
        profileNamePreview.textContent = 'あなたの氏名';
        profileIntroductionPreview.textContent = 'ここに自己紹介文が表示されます。';
    }
}

// プロフィールを保存する関数
// 保存ボタンがクリックされたときに実行されます。
function saveProfile() {
    // 各入力フィールドから現在の値を取得します。
    const profile = {
        imageURL: imageURLInput.value,
        name: nameInput.value,
        introduction: introductionInput.value
    };

    // JavaScriptオブジェクトをJSON文字列に変換します。
    // ローカルストレージには文字列しか保存できないため、この変換が必要です。
    const profileJSON = JSON.stringify(profile);

    // JSON文字列を 'myProfile' というキーでローカルストレージに保存します。
    localStorage.setItem('myProfile', profileJSON);

    // 保存後、プレビューを更新するために loadProfile 関数を呼び出します。
    loadProfile();

    alert('プロフィールが保存されました！'); // ユーザーに保存完了を通知
}

// リアルタイムプレビューを更新する関数
// 入力フィールドの値が変更されるたびに実行されます。
function updatePreview() {
    // 各入力フィールドの現在の値を取得し、直接プレビュー要素に設定します。
    // 画像URLが空の場合はプレースホルダー画像を表示します。
    profileImagePreview.src = imageURLInput.value || 'https://via.placeholder.com/150';
    profileNamePreview.textContent = nameInput.value || 'あなたの氏名';
    profileIntroductionPreview.textContent = introductionInput.value || 'ここに自己紹介文が表示されます。';
}

// イベントリスナーの設定
// 特定のイベントが発生したときに、上記で定義した関数を実行するように設定します。

// 1. ページの読み込みが完了したら、保存されているプロフィールを読み込む
window.addEventListener('load', loadProfile);

// 2. 保存ボタンがクリックされたら、プロフィールを保存する
saveProfileBtn.addEventListener('click', saveProfile);

// 3. 各入力フィールドの値が変更されるたびに、プレビューを更新する
imageURLInput.addEventListener('input', updatePreview);
nameInput.addEventListener('input', updatePreview);
introductionInput.addEventListener('input', updatePreview);
