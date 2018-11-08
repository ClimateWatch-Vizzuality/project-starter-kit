Rails.application.routes.draw do
  devise_for :admin_users
  root 'application#index'
  get '(*frontend)', to: 'application#index'
end
