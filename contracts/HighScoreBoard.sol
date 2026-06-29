// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title HighScoreBoard
/// @notice "Base Tap Rush" ゲームのオンチェーン・ハイスコア記録コントラクト。
///         各プレイヤーの自己ベストを記録し、上位10件のリーダーボードを保持する。
contract HighScoreBoard {
    struct Score {
        address player;
        uint256 score;
        uint256 timestamp;
    }

    uint256 public constant MAX_LEADERBOARD_SIZE = 10;

    /// @notice プレイヤーごとの自己ベストスコア
    mapping(address => uint256) public bestScore;

    /// @notice 上位スコアのリーダーボード（スコア降順）
    Score[] public topScores;

    event ScoreSubmitted(address indexed player, uint256 score, uint256 timestamp);
    event NewHighScore(address indexed player, uint256 score);

    /// @notice ゲーム終了後にスコアを記録する。自己ベストを更新した場合のみ
    ///         リーダーボームを更新する。
    /// @param _score プレイ結果のスコア（クライアント側で計測した値）
    function submitScore(uint256 _score) external {
        require(_score > 0, "Score must be positive");

        emit ScoreSubmitted(msg.sender, _score, block.timestamp);

        if (_score > bestScore[msg.sender]) {
            bestScore[msg.sender] = _score;
            emit NewHighScore(msg.sender, _score);
            _updateLeaderboard(msg.sender, _score);
        }
    }

    /// @notice リーダーボード全件を取得する（最大10件）
    function getTopScores() external view returns (Score[] memory) {
        return topScores;
    }

    /// @notice 現在のリーダーボード件数を取得する
    function getLeaderboardLength() external view returns (uint256) {
        return topScores.length;
    }

    function _updateLeaderboard(address player, uint256 score) internal {
        // 既存エントリーがあれば削除（自己ベストの重複を避ける）
        for (uint256 i = 0; i < topScores.length; i++) {
            if (topScores[i].player == player) {
                topScores[i] = topScores[topScores.length - 1];
                topScores.pop();
                break;
            }
        }

        topScores.push(Score(player, score, block.timestamp));

        // 配列は最大11件と小さいので挿入ソート（降順）で十分
        for (uint256 i = topScores.length; i > 1; i--) {
            if (topScores[i - 1].score > topScores[i - 2].score) {
                Score memory tmp = topScores[i - 2];
                topScores[i - 2] = topScores[i - 1];
                topScores[i - 1] = tmp;
            } else {
                break;
            }
        }

        if (topScores.length > MAX_LEADERBOARD_SIZE) {
            topScores.pop();
        }
    }
}
