// ==================== DOM要素の取得 ====================
// HTML要素にJavaScriptからアクセスするために、各要素のIDを使って参照を取得します。
const imageUploadInput = document.getElementById('imageUpload'); // 画像ファイルを選択するinput要素
const nameInput = document.getElementById('name');                 // 氏名を入力するinput要素
const introductionInput = document.getElementById('introduction'); // 自己紹介を入力するtextarea要素
const saveProfileBtn = document.getElementById('saveProfileBtn');     // プロフィールを保存するボタン
const resetImageBtn = document.getElementById('resetImageBtn');     // 画像をリセットするボタン

const profileImagePreview = document.getElementById('profileImagePreview'); // プロフィール画像のプレビュー表示要素
const profileNamePreview = document.getElementById('profileNamePreview');   // 氏名のプレビュー表示要素
const profileIntroductionPreview = document.getElementById('profileIntroductionPreview'); // 自己紹介のプレビュー表示要素

// ==================== 定数定義 ====================
// デフォルトのプレースホルダー画像URL。画像が設定されていない場合やリセットされた場合に表示される。
const DEFAULT_IMAGE_SRC = 'https://via.placeholder.com/180/E0E0E0/FFFFFF?text=No+Image';

// ==================== 関数定義 ====================

/**
 * プロフィールをローカルストレージから読み込み、表示する関数。
 * アプリが読み込まれたとき、または保存後に実行されます。
 */
function loadProfile() {
    // ローカルストレージからキー 'myProfile' で保存されたプロフィールデータをJSON文字列として取得
    const savedProfileJSON = localStorage.getItem('myProfile');

    // データが存在するかどうかを確認
    if (savedProfileJSON) {
        // JSON文字列をJavaScriptのオブジェクトに変換
        const savedProfile = JSON.parse(savedProfileJSON);

        // 取得した画像データがある場合は、それをプレビュー画像に設定
        // fileDataはBase64形式の画像データ（data:image/...;base64,...）
        if (savedProfile.fileData) {
            profileImagePreview.src = savedProfile.fileData;
        } else {
            // 画像データがない場合は、デフォルトのプレースホルダー画像を表示
            profileImagePreview.src = DEFAULT_IMAGE_SRC;
        }

        // 取得した氏名と自己紹介を入力フィールドとプレビューに設定
        // savedProfile.name || '' は、データがない場合に空文字列を設定する（安全な参照）
        nameInput.value = savedProfile.name || '';
        introductionInput.value = savedProfile.introduction || '';

        profileNamePreview.textContent = savedProfile.name || 'あなたの氏名';
        profileIntroductionPreview.textContent = savedProfile.introduction || 'ここに自己紹介文が表示されます。';
    } else {
        // 保存されたデータがない場合、プレビューを初期状態（デフォルト画像と初期テキスト）に戻す
        profileImagePreview.src = DEFAULT_IMAGE_SRC;
        profileNamePreview.textContent = 'あなたの氏名';
        profileIntroductionPreview.textContent = 'ここに自己紹介文が表示されます。';
    }
}

/**
 * プロフィールをローカルストレージに保存する関数。
 * 保存ボタンがクリックされたときに実行されます。
 * 非同期処理（await）を含むため、asyncキーワードを使用。
 */
async function saveProfile() {
    // 現在の入力フィールドの値とプレビュー画像の状態からプロフィールオブジェクトを作成
    const profile = {
        name: nameInput.value,
        introduction: introductionInput.value,
        // 現在プレビューに表示されている画像データを一時的に保存データとして設定
        fileData: profileImagePreview.src
    };

    // ユーザーが新しい画像をファイル選択でアップロードした場合の処理
    if (imageUploadInput.files && imageUploadInput.files[0]) {
        try {
            // 選択されたファイルをBase64形式に変換し、profile.fileDataに設定
            profile.fileData = await readFileAsBase64(imageUploadInput.files[0]);
        } catch (error) {
            // 画像の読み込みに失敗した場合のエラー処理
            console.error("画像の読み込みに失敗しました:", error);
            alert("画像のアップロードに失敗しました。");
            return; // これ以上処理を進めずに終了
        }
    } else if (profileImagePreview.src === DEFAULT_IMAGE_SRC) {
        // プレビューがデフォルト画像に戻されている場合、保存データとしては画像がない状態（null）とする
        profile.fileData = null;
    }
    // その他の場合（以前の画像がBase64で保存されていたり、外部URLであったりした場合）は、
    // profile.fileDataにprofileImagePreview.srcの値（Base64データまたは外部URL）がそのまま入る

    // JavaScriptオブジェクトをJSON文字列に変換（ローカルストレージは文字列しか保存できないため）
    const profileJSON = JSON.stringify(profile);

    // ローカルストレージへの保存を試みる
    try {
        localStorage.setItem('myProfile', profileJSON); // JSON文字列を 'myProfile' というキーで保存

        loadProfile(); // 保存後、最新のプロフィールを読み込み直して表示を更新
        alert('プロフィールが保存されました！'); // ユーザーに保存完了を通知
    } catch (e) {
        // 保存中にエラーが発生した場合の処理（特に容量オーバー）
        if (e.name === 'QuotaExceededError') {
            alert('保存できる容量を超えました。小さい画像を使用するか、画像をリセットしてください。');
        } else {
            alert('プロフィールの保存に失敗しました。');
        }
        console.error("保存エラー:", e); // コンソールに詳細なエラー情報を出力
    }
}

/**
 * ファイル（特に画像）をBase64形式のデータURLとして読み込む非同期関数。
 * Promiseを返すことで、非同期処理の完了を待機できる。
 * @param {File} file - 読み込むファイルオブジェクト
 * @returns {Promise<string>} Base64形式のデータURLを解決するPromise
 */
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader(); // ファイルの内容を読み込むためのAPI

        // ファイルの読み込みが成功したときに実行される処理
        reader.onload = () => {
            resolve(reader.result); // 読み込んだ結果（Base64データURL）をPromiseで返す
        };

        // ファイルの読み込み中にエラーが発生したときに実行される処理
        reader.onerror = (error) => {
            reject(error); // エラーをPromiseで返す
        };

        reader.readAsDataURL(file); // ファイルをData URL（Base64形式）として読み込み開始
    });
}

/**
 * 入力フィールドや画像選択の変更に合わせて、リアルタイムでプレビューを更新する関数。
 */
function updatePreview() {
    // 画像ファイルが選択されているか確認
    if (imageUploadInput.files && imageUploadInput.files[0]) {
        const file = imageUploadInput.files[0];
        const reader = new FileReader(); // FileReaderオブジェクトを新しく作成

        // ファイルの読み込みが完了した時の処理（プレビュー画像を更新）
        reader.onload = (e) => {
            profileImagePreview.src = e.target.result; // 読み込んだ画像データ（Base64）をプレビューのsrcに設定
        };

        // ファイルをData URL（Base64）として読み込み開始
        reader.readAsDataURL(file);
    } else {
        // ファイルが選択されていない場合、プレビュー画像をデフォルトに戻す
        profileImagePreview.src = DEFAULT_IMAGE_SRC;
    }

    // 氏名と自己紹介文を、現在の入力値でプレビューを更新
    // 入力値が空の場合は、デフォルトのテキストを表示
    profileNamePreview.textContent = nameInput.value || 'あなたの氏名';
    profileIntroductionPreview.textContent = introductionInput.value || 'ここに自己紹介文が表示されます。';
}

/**
 * プロフィール画像をリセットする関数。
 * リセットボタンがクリックされたときに実行されます。
 */
function resetImage() {
    imageUploadInput.value = ''; // ファイル選択フィールドの値をクリア（選択されたファイルを解除）
    profileImagePreview.src = DEFAULT_IMAGE_SRC; // プレビュー画像をデフォルトに戻す
    // ※注意：この操作はプレビューをリセットするだけで、ローカルストレージのデータは変更されません。
    // 変更を永続化するには、その後「プロフィールを保存」ボタンを押す必要があります。
}

// ==================== イベントリスナーの設定 ====================
// 各要素で特定のイベントが発生したときに、上記で定義した関数を実行するように設定します。

// ページの読み込みが完了したら、保存されているプロフィールを読み込む
window.addEventListener('load', loadProfile);

// 保存ボタンがクリックされたら、プロフィールを保存する
saveProfileBtn.addEventListener('click', saveProfile);

// 画像ファイル選択が変更されたら、プレビューを更新する
// 'change'イベントはファイルが選択されたときに発生します。
imageUploadInput.addEventListener('change', updatePreview);

// 氏名入力フィールドの値が変更されるたびに、プレビューを更新する
// 'input'イベントは入力値が変わるたびに発生します。
nameInput.addEventListener('input', updatePreview);

// 自己紹介入力フィールドの値が変更されるたびに、プレビューを更新する
introductionInput.addEventListener('input', updatePreview);

// 画像リセットボタンがクリックされたら、画像をリセットする
resetImageBtn.addEventListener('click', resetImage);
